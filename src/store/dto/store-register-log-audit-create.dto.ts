import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsIn, IsOptional, MaxLength } from "class-validator";
import { AuditStatus } from "src/common/enums";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class StoreRegisterLogAuditCreateDto {
    @ApiProperty({ description: '심사 상태', enum: AuditStatus, example: AuditStatus.Approved })
    @IsEnum(AuditStatus)
    @IsIn([AuditStatus.Approved, AuditStatus.Rejected])
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.toUpperCase() as AuditStatus;
        }
        return value;
    })
    auditStatus: AuditStatus;

    @ApiPropertyOptional({ description: '심사 코멘트', example: '심사 코멘트' })
    @IsOptional()
    @IsRequiredString()
    @MaxLength(255)
    comment?: string | null;
}