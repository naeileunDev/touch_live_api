import { DataSource, DeleteResult, In, LessThan, Repository } from "typeorm";
import { StoreFollow } from "../entity/store-follow.entity";
import { Injectable } from "@nestjs/common";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { StoreFollowsDto } from "../dto/store-follows.dto";
import { Store } from "src/store/entity/store.entity";

@Injectable()
export class StoreFollowRepository extends Repository<StoreFollow> {
    constructor(private readonly dataSource: DataSource) {
        super(StoreFollow, dataSource.createEntityManager());
    }

    async createStoreFollow(followerId: number, storeId: number): Promise<StoreFollow> {
        const entity = this.create({ followerId, storeId });
        await this.save(entity);
        return entity;
    }

    async findById(id: number): Promise<StoreFollow> {
        const entity = await this.findOne({ where: { id } });
        return entity;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }

    async findByStoreId(followerId: number, storeId: number): Promise<StoreFollow> {
        return await this.findOne({ where: { followerId, storeId } });
    }

    async existsByStoreIdWithDeleted(followerId: number, storeId: number): Promise<boolean> {
        return await this.exists({ where: { followerId, storeId }, withDeleted: true });
    }
    
    async restoreByStoreIdFast(followerId: number, storeId: number): Promise<boolean> {
        const result = await this.createQueryBuilder()
            .restore()
            .where('followerId = :followerId', { followerId })
            .andWhere('storeId = :storeId', { storeId })
            .andWhere('deletedAt IS NOT NULL')
            .execute();
        return result.affected > 0;
    }

    async findFollowingStoresFollowerCounts(userId: number, lastId: number | null, limit: number = 7): Promise<[Store[], number]> {
        if (lastId != null) {
            const [stores, count] = await this.findAndCount({ where: { followerId: userId, id: LessThan(lastId) }, relations: ['follower', 'store'], order: { createdAt: 'DESC' }, take: limit });
            return [stores.map(s => s.store), count];
        }
        const [stores, count] = await this.findAndCount({ where: { followerId: userId }, relations: ['follower', 'store'], order: { createdAt: 'DESC' }, take: limit });
        return [stores.map(s => s.store), count];
    }

    async deleteByStoreIds(userId: number, storeIds: number[]): Promise<boolean> {
        const result = await this.createQueryBuilder()
        .delete()
        .where('followerId = :followerId', { followerId: userId })
        .andWhere('storeId IN (:...storeIds)', { storeIds })
        .execute();
    return result.affected > 0;
    }

    async countFollowersByStoreId(storeId: number): Promise<number> {
        return await this.count({ where: { storeId: storeId } });
    }
}