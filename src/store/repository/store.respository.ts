import { DataSource, DeepPartial, Repository } from "typeorm";
import { Store } from "../entity/store.entity";
import { Injectable } from "@nestjs/common";
import { StoreCreateDto } from "../dto/store-create.dto";
import { User } from "src/user/entity/user.entity";

@Injectable()
export class StoreRepository extends Repository<Store> {
    constructor(private dataSource: DataSource) {
        super(Store, dataSource.createEntityManager());
    }
}