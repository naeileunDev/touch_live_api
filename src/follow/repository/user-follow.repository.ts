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

    async findAndCountByUsersId(followingId: number, followerId: number, lastId: number | null, limit: number): Promise<[UserFollow[], number]> {
        if (lastId != null) {
            return await this.findAndCount({
                where: { followingId, followerId, id: LessThan(lastId) },
                relations: ['following'],
                order: { createdAt: 'DESC' },
                take: limit,
            });
        }
        
        return await this.findAndCount({
            where: { followingId, followerId },
            relations: ['following'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    // 팔로워 목록 return
    async findFollowers(followingId: number, lastId: number | null, limit: number): Promise<[UserFollow[], number]> {
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
}