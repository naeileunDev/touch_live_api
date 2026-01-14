import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNumber, ValidateNested } from "class-validator";
import { TermType } from "../enum/term-version.enum";

export class TermLogCreateDto {
    @ApiProperty({ description: '약관 타입', enum: TermType, example: TermType.LocationBased })
    @IsEnum(TermType)
    termType: TermType;

    @ApiProperty({ description: '동의 여부', example: true })
    @IsBoolean()
    isAgreed: boolean;

    @ApiProperty({ description: '약관 버전 ID', example: 1 })
    @IsNumber()
    termVersionId: number;

    @ApiProperty({ description: '필수 여부', example: true })
    @IsBoolean()
    isRequired: boolean;
}