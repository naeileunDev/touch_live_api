import { DataSource, DeleteResult, LessThan, Repository } from "typeorm";
import { StoreFollow } from "../entity/store-follow.entity";
import { Injectable } from "@nestjs/common";
import { ServiceException } from "src/common/filter/exception/service.exception";

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

    async findFollowingStoresFollowerCounts(storeId: number, lastId: number | null, limit: number = 7): Promise<[StoreFollow[], number]> {
        if (lastId != null) {
            return await this.findAndCount({ where: { storeId, id: LessThan(lastId) }, relations: ['follower', 'store'], order: { createdAt: 'DESC' }, take: limit });
        }
        return await this.findAndCount({ where: { storeId }, relations: ['follower', 'store'], order: { createdAt: 'DESC' }, take: limit });
    }
}