import { Injectable } from "@nestjs/common";
import { TermVersion } from "../entity/term-version.entity";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { UserTermAgreementChangeLog } from "../entity/user-term-agreement-change-log.entity";

@Injectable()
export class UserTermAgreementChangeLogRepository extends Repository<UserTermAgreementChangeLog> {
    constructor(private dataSource: DataSource) {
        super(TermVersion, dataSource.createEntityManager());
    }

    async createUserTermAgreementChangeLog(log: UserTermAgreementChangeLog): Promise<UserTermAgreementChangeLog> {
        const entity = this.create(log);
        return await this.save(entity);
    }

    async findById(id: number): Promise<UserTermAgreementChangeLog> {
        const entity = await this.findOne({ 
            where: { id },
        });
        if (!entity) {
            throw new ServiceException(MESSAGE_CODE.USER_TERM_AGREEMENT_CHANGE_LOG_NOT_FOUND);
        }
        return entity;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }
}