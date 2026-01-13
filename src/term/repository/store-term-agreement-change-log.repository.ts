import { Injectable } from "@nestjs/common";
import { TermVersion } from "../entity/term-version.entity";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { UserTermAgreementChangeLog } from "../entity/user-term-agreement-change-log.entity";
import { StoreTermAgreementChangeLog } from "../entity/store-term-agreement-change-log.entity";

@Injectable()
export class StoreTermAgreementChangeLogRepository extends Repository<StoreTermAgreementChangeLog> {
    constructor(private dataSource: DataSource) {
        super(TermVersion, dataSource.createEntityManager());
    }

    async createStoreTermAgreementChangeLog(log: StoreTermAgreementChangeLog): Promise<StoreTermAgreementChangeLog> {
        const entity = this.create(log);
        return await this.save(entity);
    }

    async findById(id: number): Promise<StoreTermAgreementChangeLog> {
        const entity = await this.findOne({ 
            where: { id },
        });
        if (!entity) {
            throw new ServiceException(MESSAGE_CODE.STORE_TERM_AGREEMENT_CHANGE_LOG_NOT_FOUND);
        }
        return entity;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }
}