import { DataSource, DeleteResult, Repository } from "typeorm";
import { AuditRequest } from "../entity/audit-request.entity";
import { Injectable } from "@nestjs/common";
import { AuditRequestCreateDto } from "../dto/audit-request-create.dto";
import { AuditType } from "../enum/audit-type.enum";

@Injectable()
export class AuditRequestRepository extends Repository<AuditRequest> {
    constructor(private readonly dataSource: DataSource) {
        super(AuditRequest, dataSource.createEntityManager());
    }

    async createAuditRequest(auditRequest: AuditRequestCreateDto, userId: number): Promise<AuditRequest> {
        const entity = this.create({
            ...auditRequest,
            userId,
        });
        return await this.save(entity);
    }

    // 해당 유저 심사 요청 목록 조회
    async findByUserId(userId: number): Promise<AuditRequest[]> {
        return await this.find({
            where: {
                userId,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    // 해당 분야 심사 요청 목록 조회
    async findByUserIdAndTargetType(userId: number, targetType: AuditType): Promise<AuditRequest[]> {
        return await this.find({
            where: {
                userId,
                targetType,
            },
        });
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ id });
        return rtn.affected === 0 ? false : true;
    }
}