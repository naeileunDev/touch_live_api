import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { UserFollow } from './entity/user-follow.entity';
import { UserFollowRepository } from './repository/user-follow.repository';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class FollowService {
    constructor(
        // @InjectRepository(UserFollow)
        // private readonly followRepository: Repository<UserFollow>,
        private readonly userFollowRepository: UserFollowRepository,
        private readonly userService: UserService,
    ) {}

    // 이미 팔로우 되있으면 언팔, 없으면 팔로우 
    async followAndUnfollow(followerId: number, followingId: number): Promise<UserFollow | boolean> {
        if (followerId === followingId) {
            throw new ServiceException(MESSAGE_CODE.FOLLOW_NOT_ALLOWED_SELF);
        }
        const existing = await this.userFollowRepository.findByUsersId(followerId, followingId);
        if (existing) {
            return await this.userFollowRepository.deleteByUsersId(followerId, followingId);
        }
        const deleted = await this.userFollowRepository.existsByUsersIdWithDeleted(followerId, followingId);
        if (deleted) {
            return await this.userFollowRepository.restoreByUsersIdFast(followerId, followingId);
        }
        return await this.userFollowRepository.createUserFollow(followerId, followingId);
    }

    // 팔로우 또는 팔로잉 목록 return 
    async findByUsersId(followingId: number, followerId: number, lastId: number | null, limit: number) {
        const [items, total] = await this.userFollowRepository.findAndCountByUsersId(followingId, followerId, lastId, limit);
        return { 
            items: items.map(f => f.following), 
            total
        };
    }

    async findFollowers(followingId: number, lastId: number | null, limit: number) {
        const [items, total] = await this.userFollowRepository.findFollowers(followingId, lastId, limit);
        return { 
            items: items.map(f => f.follower), 
            total
        };
    }

    async findFollowings(followerId: number, lastId: number | null, limit: number) {
        const [items, total] = await this.userFollowRepository.findFollowings(followerId, lastId, limit);
        return { 
            items: items.map(f => f.following), 
            total
        };
    }

    async findCountFollowOrFollower(userId: number, isFollowers: boolean): Promise<number> {
        if (isFollowers) {
            // 팔로워 수: 나를 팔로우하는 사람 수
            return this.userFollowRepository.count({ where: { followingId: userId } });
        }
        // 팔로잉 수: 내가 팔로우하는 사람 수
        return this.userFollowRepository.count({ where: { followerId: userId } });
    }
}
