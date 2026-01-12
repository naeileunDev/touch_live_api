import { ApiProperty } from "@nestjs/swagger";
import { AuditType } from "../enum/audit-type.enum";

export class AuditRequestCreateDto {
    @ApiProperty({ description: '대상 타입', enum: AuditType, example: AuditType.Store })
    targetType: AuditType;

    @ApiProperty({ description: '대상 로그 ID', example: 1 })
    targetLogId: number;
}