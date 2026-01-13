import { DataSource, DeleteResult, Repository } from "typeorm";
import { Store } from "../entity/store.entity";
import { Injectable } from "@nestjs/common";
import { StoreRegisterLogDto } from "../dto/store-register-log.dto";
import { User } from "src/user/entity/user.entity";
import { StoreStatusType } from "../enum/store-status-type.enum";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { StoreRegisterLog } from "../entity/store-register-log.entity";

@Injectable()
export class StoreRepository extends Repository<Store> {
    constructor(private dataSource: DataSource) {
        super(Store, dataSource.createEntityManager());
    }
    
    async createStore(log: StoreRegisterLog, fee: number): Promise<Store> {
        const store = this.create({
            ...log, 
            status: StoreStatusType.Active,
            isVisible: true,    
            saleChageRate: fee,
        });
        await this.save(store);
        return store;
    }
    async findById(id: number): Promise<Store> {
        const store = await this.findOne({
            where: {
                id,
            },
            relations: ['user'],
        });
        return store;
    }
    async deleteById(id: number): Promise<boolean> {
        const store = await this.findById(id);
        if (!store) {
            throw new ServiceException(MESSAGE_CODE.STORE_NOT_FOUND);
        }
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }
}