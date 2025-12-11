import { DataSource, Repository } from "typeorm";
import { Store } from "../entity/store.entity";
import { Injectable } from "@nestjs/common";
import { StoreCreateDto } from "../dto/store-create.dto";
import { User } from "src/user/entity/user.entity";

@Injectable()
export class StoreRepository extends Repository<Store> {
    constructor(private dataSource: DataSource) {
        super(Store, dataSource.createEntityManager());
    }

    async createStore(storeCreateDto: StoreCreateDto, user: User): Promise<Store> {
        const store = this.create(storeCreateDto);
        store.user = user;
        return await this.save(store);
    }
}