import { DataSource, DeleteResult, Repository } from "typeorm";
import { StoreFollow } from "../entity/store-follow.entity";
import { Injectable } from "@nestjs/common";
import { ServiceException } from "src/common/filter/exception/service.exception";

@Injectable()
export class StoreFollowRepository extends Repository<StoreFollow> {
    constructor(private readonly dataSource: DataSource) {
        super(StoreFollow, dataSource.createEntityManager());
    }

    async createStoreFollow(storeFollow: StoreFollow): Promise<StoreFollow> {
        const entity = this.create(storeFollow);
        return this.save(entity);
    }

    async findById(id: number): Promise<StoreFollow> {
        const entity = await this.findOne({ where: { id } });
        return entity;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }
}