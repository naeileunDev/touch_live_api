import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { UserFollow } from '../entity/user-follow.entity';
import { UserFollowRepository } from '../repository/user-follow.repository';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class UserFollowService {
    constructor(
        private readonly userFollowRepository: UserFollowRepository,
        private readonly userService: UserService,
    ) {}

    // 이미 팔로우 되있으면 언팔, 없으면 팔로우 
    async followAndUnfollow(followerId: string, followingId: string): Promise<UserFollow | boolean> {
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
        return await this.userFollowRepository.createUserFollow(follower.id, following.id);
    }

    async findFollowers(followingId: string, lastId: number | null, limit: number) {
        const following = await this.userService.findEntityByPublicId(followingId);
        const [items, total] = await this.userFollowRepository.findFollowers(following.id, lastId, limit);
        return { 
            items: items.map(f => f.follower), 
            total
        };
    }

    async findFollowings(followerId: string, lastId: number | null, limit: number) {
        const follower = await this.userService.findEntityByPublicId(followerId);
        const [items, total] = await this.userFollowRepository.findFollowings(follower.id, lastId, limit);
        return { 
            items: items.map(f => f.following), 
            total
        };
    }

    async findCountFollowOrFollower(publicId: string, isFollowers: boolean): Promise<number> {
        const user = await this.userService.findEntityByPublicId(publicId);
        if (!user) {
            throw new ServiceException(MESSAGE_CODE.USER_NOT_FOUND);
        }
        const userId = user.id;
        // 해당 유저가 팔로워라면 내가 팔로잉하는 사람 수를 조회  
        if (!isFollowers) {
            return await this.userFollowRepository.count({ where: { followingId: userId } });
        }
        // 해당 유저를 팔로잉하는 사람 수를 조회  
        return await this.userFollowRepository.count({ where: { followerId: userId } });
    }
}
