import { DataSource, DeleteResult, Repository } from "typeorm";
import { Store } from "../entity/store.entity";
import { Injectable } from "@nestjs/common";
import { StoreRegisterLogCreateDto } from "../dto/store-register-log-create.dto";

@Injectable()
export class StoreRepository extends Repository<Store> {
    constructor(private dataSource: DataSource) {
        super(Store, dataSource.createEntityManager());
    }
    
    async createStore(createDto: StoreRegisterLogCreateDto): Promise<Store> {
        const store = this.create(createDto);
        return await this.save(store);
    }
    async findById(id: number): Promise<Store> {
        const store = await this.findOne({
            where: {
                id,
            },
        });
        return store;
    }
    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }
}