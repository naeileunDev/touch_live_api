import { DataSource, Repository } from "typeorm";
import { StoreMedia } from "../entities/store-media.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StoreMediaRepository extends Repository<StoreMedia> {
    constructor(private readonly dataSource: DataSource) {
        super(StoreMedia, dataSource.createEntityManager());
    }

    async createStoreMedia(storeMedia: StoreMedia): Promise<StoreMedia> {
        const entity = this.create(storeMedia);
        await this.save(entity);
        return entity;
    }

    async findById(id: number): Promise<StoreMedia> {
        return await this.findOne({ 
            where: { id },
            relations: ['file', 'store']
        });
    }

    async deleteById(id: number): Promise<boolean> {
        const result = await this.softDelete({ id });
        return result.affected > 0;
    }
    
    
}