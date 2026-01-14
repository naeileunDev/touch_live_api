import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";
import { TargetType, TermType } from "../enum/term-version.enum";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class TermVersionCreateDto {
    @ApiProperty({ description: '약관 타입', enum: TermType, example: TermType.LocationBased })
    @IsEnum(TermType)
    termType: TermType;

    @ApiProperty({ description: '대상 타입', enum: TargetType, example: TargetType.User })
    @IsEnum(TargetType)
    targetType: TargetType;

    @ApiProperty({ description: '약관 내용', example: '약관 내용' })
    @IsRequiredString()
    content: string;

    @ApiProperty({ description: '필수 여부', example: true })
    @IsBoolean()
    isRequired: boolean;
}