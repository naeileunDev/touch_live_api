import { DataSource, DeleteResult, LessThan, MoreThan, Repository } from "typeorm";
import { UserFollow } from "../entity/user-follow.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserFollowRepository extends Repository<UserFollow> {
    constructor(private dataSource: DataSource) {
        super(UserFollow, dataSource.createEntityManager());
    }

    async createUserFollow(followerId: number, followingId: number): Promise<UserFollow> {
        const entity = this.create({ followerId, followingId });
        return this.save(entity);
    }

    async findByUsersId(followerId: number, followingId: number): Promise<UserFollow | boolean> {
        const existing = await this.existsByUsersId(followerId, followingId);
        if (!existing) {
            return existing;
        }
        return await this.findOne({ where: { followerId, followingId } });
    }

    async existsByUsersId(followerId: number, followingId: number): Promise<boolean> {
        return await this.exists({ where: { followerId, followingId } });
    }

    // 삭제 후 복구 위한 메서드
    async existsByUsersIdWithDeleted(followerId: number, followingId: number): Promise<boolean> {
        return await this.exists({ 
            where: { 
                followerId, 
                followingId 
            }, 
            withDeleted: true,
        });
    }

    async deleteByUsersId(followerId: number, followingId: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ followerId, followingId });
        return rtn.affected > 0;
    }
    // 쿼리 빌더가 더 빨라서 해당 메서드 사용 (삭제된 데이터 복구)    
    async restoreByUsersIdFast(followerId: number, followingId: number): Promise<boolean> {
        const result = await this.createQueryBuilder()
            .restore()
            .where('followerId = :followerId', { followerId })
            .andWhere('followingId = :followingId', { followingId })
            .andWhere('deletedAt IS NOT NULL')
            .execute();
        
        return result.affected > 0;
    }

    // 팔로워 목록 return
    async findFollowers(followingId: number, lastId: number | null, limit: number = 7): Promise<[UserFollow[], number]> {
        if (lastId != null) {
            return await this.findAndCount({
                where: { followingId, id: LessThan(lastId) },
                relations: ['follower'],
                order: { createdAt: 'DESC' },
                take: limit,
            });
        }
        return await this.findAndCount({
            where: { followingId },
            relations: ['follower'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    // 팔로잉 목록 return
    async findFollowings(followerId: number, lastId: number | null, limit: number): Promise<[UserFollow[], number]> {
        if (lastId != null) {
            return await this.findAndCount({
                where: { followerId, id: LessThan(lastId) },
                relations: ['following'],
                order: { createdAt: 'DESC' },
                take: limit,
            });
        }
        return await this.findAndCount({
            where: { followerId },
            relations: ['following'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    /**
     * 특정 유저 ID들의 팔로워 수를 집계
     * @param followingIds 팔로잉 ID 배열
     * @returns [{ followingId: number, count: string }] 형태의 배열
     */
    async findFollowersCountByIds(followingIds: number[]): Promise<Array<{ followingId: number, count: string }>> {
        if (followingIds.length === 0) {
            return [];
        }
        return await this.createQueryBuilder('user_follow')
            .select('user_follow', 'userFollow')
            .addSelect('COUNT(userFollow.followerId)', 'count')
            .where('userFollow.followerId IN (:...followingIds)', { followingIds })
            .andWhere('userFollow.deletedAt IS NULL')
            .groupBy('userFollow.followingId')
            .getRawMany();
    }

    /**
     * 특정 유저가 팔로잉하는 유저 ID 목록 조회
     * @param followerId 팔로워 ID (팔로우하는 유저)
     * @returns 팔로잉하는 유저 ID 배열
     */
    async findFollowingIdsByFollowerId(followerId: number): Promise<number[]> {
        const followings = await this.find({
            where: { followerId },
            select: ['followingId'],
        });
        return followings.map(f => f.followingId);
    }

    async deleteByUsersIds(followerId: number, followingIds: number[]): Promise<boolean> {
        const result = await this.createQueryBuilder()
            .delete()
            .where('followerId = :followerId', { followerId })
            .andWhere('followingId IN (:...followingIds)', { followingIds })
            .execute();
        return result.affected > 0;
    }
}