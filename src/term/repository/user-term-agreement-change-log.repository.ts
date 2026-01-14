import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { UserTermAgreementChangeLog } from "../entity/user-term-agreement-change-log.entity";
import { TermLogCreateDto } from "../dto/term-log-create.dto";

@Injectable()
export class UserTermAgreementChangeLogRepository extends Repository<UserTermAgreementChangeLog> {
    constructor(private dataSource: DataSource) {
        super(UserTermAgreementChangeLog, dataSource.createEntityManager());
    }

    async createUserTermAgreementChangeLog(dtos: TermLogCreateDto[], userId: number): Promise<boolean> {
        const entities = dtos.map((dto) => this.create({
            ...dto,
            userId: userId,
        }));
        await this.save(entities as unknown as UserTermAgreementChangeLog[]);
        return true;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }

    async findOptionalTermsStatus(userId: number): Promise<UserTermAgreementChangeLog[]> {
        return await this.createQueryBuilder('log')
            .select('DISTINCT ON (log.termType) log.id', 'log_id') 
            .addSelect('log.*') 
            .where('log.userId = :userId', { userId })
            .andWhere('log.isRequired = false')
            .orderBy('log.termType', 'ASC') // DISTINCT ON의 첫 번째 인자와 일치 필수
            .addOrderBy('log.id', 'DESC')
            .getRawMany(); // DISTINCT ON 사용 시 매핑 이슈 방지를 위해 getRawMany 후 변환 
    }

}