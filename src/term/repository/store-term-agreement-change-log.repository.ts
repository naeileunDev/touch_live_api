import { Injectable } from "@nestjs/common";
import { TermVersion } from "../entity/term-version.entity";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { StoreTermAgreementChangeLog } from "../entity/store-term-agreement-change-log.entity";
import { TermLogCreateDto } from "../dto/term-log-create.dto";
import { User } from "src/user/entity/user.entity";
import { UserTermAgreementChangeLog } from "../entity/user-term-agreement-change-log.entity";
import { TargetType } from "../enum/term-version.enum";

@Injectable()
export class StoreTermAgreementChangeLogRepository extends Repository<StoreTermAgreementChangeLog> {
    constructor(private dataSource: DataSource) {
        super(TermVersion, dataSource.createEntityManager());
    }

    async createStoreTermAgreementChangeLog(dtos: TermLogCreateDto[], user: User): Promise<boolean> {
        const entities = dtos.map((dto) => this.create({
            ...dto,
            userId: user.id,
            storeId: user.store.id,
        }));
        await this.save(entities as unknown as UserTermAgreementChangeLog[]);
        return true;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }

    async findOptionalTermsStatus(storeId: number): Promise<StoreTermAgreementChangeLog[]> {
        return await this.createQueryBuilder('log')
            .select('DISTINCT ON (log.termType) log.id', 'log_id') 
            .addSelect('log.*') 
            .where('log.storeId = :storeId', { storeId })
            .andWhere('log.isRequired = false')
            .orderBy('log.termType', 'ASC') // DISTINCT ON의 첫 번째 인자와 일치 필수
            .addOrderBy('log.id', 'DESC')
            .getRawMany(); // DISTINCT ON 사용 시 매핑 이슈 방지를 위해 getRawMany 후 변환 
    }
}