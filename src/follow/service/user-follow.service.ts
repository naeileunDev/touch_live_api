import { Injectable } from '@nestjs/common';
import { UserFollowRepository } from '../repository/user-follow.repository';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { UserService } from 'src/user/service/user.service';
import { UserFollowsDto } from '../dto/user-follows.dto';
import { FollowingUserDto } from '../dto/following-user.dto';
import { StoreFollowService } from './store-follow.service';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class UserFollowService {
    constructor(
        private readonly userFollowRepository: UserFollowRepository,
        private readonly userService: UserService,
        private readonly storeFollowService: StoreFollowService,
    ) {}

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        if (followerId === followingId) {
            throw new ServiceException(MESSAGE_CODE.FOLLOW_NOT_ALLOWED_SELF);
        }
        const follower = await this.userService.findEntityByPublicId(followerId);
        const following = await this.userService.findEntityByPublicId(followingId);
        if (!follower || !following) {
           throw new ServiceException(MESSAGE_CODE.USER_NOT_FOUND);
        }
        return await this.userFollowRepository.existsByUsersId(follower.id, following.id);
    }

    // 이미 팔로우 되있으면 언팔, 없으면 팔로우 
    async followAndUnfollow(followerId: string, followingId: string): Promise<boolean> {
        const follower = await this.userService.findEntityByPublicId(followerId);
        const following = await this.userService.findEntityByPublicId(followingId);
        if (!follower || !following) {
            throw new ServiceException(MESSAGE_CODE.USER_NOT_FOUND);
        }
        if (followerId === followingId) {
            throw new ServiceException(MESSAGE_CODE.FOLLOW_NOT_ALLOWED_SELF);
        }
        const existing = await this.userFollowRepository.findByUsersId(follower.id, following.id);
        if (existing) {
            return await this.userFollowRepository.deleteByUsersId(follower.id, following.id);
        }
        const deleted = await this.userFollowRepository.existsByUsersIdWithDeleted(follower.id, following.id);
        if (deleted) {
            return await this.userFollowRepository.restoreByUsersIdFast(follower.id, following.id);
        }
        await this.userFollowRepository.createUserFollow(follower.id, following.id);
        return true;
    }

    async findCountFollowOrFollower(publicId: string, isFollowers: boolean): Promise<number> {
        const user = await this.userService.findEntityByPublicId(publicId);
        const userId = user.id;
        // 해당 유저가 팔로워라면 내가 팔로잉하는 사람 수를 조회  
        if (!isFollowers) {
            return await this.userFollowRepository.count({ where: { followingId: userId } });
        }
        // 해당 유저를 팔로잉하는 사람 수를 조회  
        return await this.userFollowRepository.count({ where: { followerId: userId } });
    }

    /**
     * 특정 유저가 팔로잉하는 유저들의 팔로워 수를 반환
     * @param followerPublicId 팔로우하는 유저의 publicId
     * @returns [{ followingId: number, count: number }] 형태의 배열
     * Ui 상 무한 스크롤로 7개씩 조회가능하기때문에 limit 기본값을 7로 설정
     * 예시: User A가 User B, User C를 팔로우하는 경우
     * - User B의 팔로워 수와 User C의 팔로워 수를 반환
     */
    async findFollowingUsersFollowerCounts(followerPublicId: string, pagination: PaginationDto): Promise<UserFollowsDto> {
        const follower = await this.userService.findEntityByPublicId(followerPublicId);
        const { page, limit } = pagination;
        const followings = await this.userFollowRepository.findFollowings(follower.id, page, limit);

        const followingIds = followings[0].map(f => f.followingId);
        
        if (followingIds.length === 0) {
            return new UserFollowsDto([], 0);
        }
        const followingUsers: FollowingUserDto[] = [];
        for (const following of followings[0]) {
            const followersCount = await this.userFollowRepository.count({ where: { followingId: following.followingId } });
            followingUsers.push(new FollowingUserDto(following, followersCount));
        }
       
        return new UserFollowsDto(followingUsers, followings[1]);
    }

    async unfollow(publicId: string, followingIds: number[]): Promise<boolean> {
        const follower = await this.userService.findEntityByPublicId(publicId);
        return await this.userFollowRepository.deleteByUsersIds(follower.id, followingIds);
    }
    
    // 해당 유저의 유저 팔로잉 수와 스토어 팔로잉 수를 합쳐서 반환
    async findTotalFollowers(userId: string): Promise<number> {
        const user = await this.userService.findEntityByPublicId(userId);
        const userFollowers = await this.userFollowRepository.count({ where: { followerId: user.id } });
        const storeFollowers = await this.storeFollowService.findCountFollowers(user.id);
        return userFollowers + storeFollowers;
    }
}
