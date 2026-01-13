import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, MaxLength } from "class-validator";
import { AuditStatus } from "src/common/enums";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { Transform } from "class-transformer";

export class StoreRegisterLogAuditDto {

    @ApiProperty({ description: '가게 등록 로그 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '심사 상태', enum: AuditStatus, example: AuditStatus.Approved })
    @IsEnum(AuditStatus)
    @Transform(({ value }) => {
        return value.toUpperCase() as AuditStatus;
    })
    auditStatus: AuditStatus;

    @ApiPropertyOptional({ description: '심사 코멘트', example: '심사 코멘트' })
    @IsOptional()
    @IsRequiredString()
    @MaxLength(255)
    comment?: string | null;

    constructor(log: StoreRegisterLog) {
        this.id = log.id;
        this.auditStatus = log.auditStatus;
        this.comment = log.comment ?? null;
    }
}