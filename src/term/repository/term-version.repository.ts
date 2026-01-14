import { Injectable } from "@nestjs/common";
import { TermVersion } from "../entity/term-version.entity";
import { DataSource, DeleteResult, In, Repository } from "typeorm";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { TermVersionCreateDto } from "../dto/term-version-create.dto";
import { User } from "src/user/entity/user.entity";
import { TargetType, TermType } from "../enum/term-version.enum";

@Injectable()
export class TermVersionRepository extends Repository<TermVersion> {
    constructor(private dataSource: DataSource) {
        super(TermVersion, dataSource.createEntityManager());
    }

    async createTermVersion(dto: TermVersionCreateDto, user: User): Promise<TermVersion> {
        const entity = this.create(dto);
        entity.operatorId = user.id;
        return await this.save(entity);
    }

    async findById(id: number): Promise<TermVersion> {
        const entity = await this.findOne({ 
            where: { id },
        });
        if (!entity) {
            throw new ServiceException(MESSAGE_CODE.TERM_VERSION_NOT_FOUND);
        }
        return entity;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected > 0;
    }

    async findByTargetType(targetType: TargetType, termType: TermType): Promise<TermVersion> {
        const entity = await this.findOne({ 
            where: { termType, targetType },
            order: { version: 'DESC' },
        });
        return entity;
    }

    async findByRequired(isRequired: boolean, targetType: TargetType): Promise<TermVersion> {
        const entity = await this.findOne({ 
            where: { isRequired, targetType },
            order: { version: 'DESC' },
        });
        return entity;
    }

    async findByIds(ids: number[]): Promise<TermVersion[]> {
        const entities = await this.find({ 
            where: { id: In(ids) },
        });
        return entities;
    }

    async getLatestTermsForTargetType(targetType: TargetType): Promise<TermVersion[]> {
        return await this.createQueryBuilder('term')
            .where('term.targetType = :targetType', { targetType })
            .andWhere('term.id IN ' + 
                this.createQueryBuilder('sub')
                    .select('MAX(sub.id)')
                    .groupBy('sub.termType').getQuery()
            )
            .getMany();
    }



}