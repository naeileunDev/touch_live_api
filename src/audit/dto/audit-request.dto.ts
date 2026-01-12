import { ApiProperty } from "@nestjs/swagger";
import { AuditType } from "../enum/audit-type.enum";
import { AuditRequest } from "../entity/audit-request.entity";
import { User } from "src/user/entity/user.entity";

export class AuditRequestDto {
    @ApiProperty({ description: '감사 요청 식별자', example: 1 })
    id: number;

    @ApiProperty({ description: '대상 타입', enum: AuditType, example: AuditType.Store })
    targetType: AuditType;

    @ApiProperty({ description: '대상 로그 ID', example: 1 })
    targetLogId: number;

    @ApiProperty({ description: '사용자 식별자', example: 'uuid' })
    userId: string;

    constructor(auditRequest: AuditRequest, user: User) {
        this.id = auditRequest.id;
        this.targetType = auditRequest.targetType;
        this.targetLogId = auditRequest.targetLogId;
        this.userId = user.publicId;
    }
}