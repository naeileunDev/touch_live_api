import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFollow } from './entities/user-follow.entity';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(UserFollow)
        private readonly followRepository: Repository<UserFollow>,
    ) {}

    async follow(followerId: number, followingId: number): Promise<{ followed: boolean }> {
        if (followerId === followingId) {
            throw new BadRequestException('자기 자신을 팔로우할 수 없습니다.');
        }

        const existing = await this.followRepository.findOne({
            where: { followerId, followingId },
        });

        if (existing) {
            await this.followRepository.remove(existing);
            return { followed: false };
        }

        const follow = this.followRepository.create({ followerId, followingId });
        await this.followRepository.save(follow);
        return { followed: true };
    }

    async isFollowing(followerId: number, followingId: number): Promise<boolean> {
        const count = await this.followRepository.count({
            where: { followerId, followingId },
        });
        return count > 0;
    }

    async getFollowers(userId: number, page = 1, limit = 20) {
        const [items, total] = await this.followRepository.findAndCount({
            where: { followingId: userId },
            relations: ['follower'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items: items.map(f => f.follower), total, page, limit };
    }

    async getFollowing(userId: number, page = 1, limit = 20) {
        const [items, total] = await this.followRepository.findAndCount({
            where: { followerId: userId },
            relations: ['following'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items: items.map(f => f.following), total, page, limit };
    }

    async getFollowerCount(userId: number): Promise<number> {
        return this.followRepository.count({ where: { followingId: userId } });
    }

    async getFollowingCount(userId: number): Promise<number> {
        return this.followRepository.count({ where: { followerId: userId } });
    }
}
