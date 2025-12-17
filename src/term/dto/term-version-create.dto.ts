import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";
import { TermType } from "../enum/term-type.enum";
import { TermTargetCategoryType } from "../enum/term-target-category-type.enum";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class TermVersionCreateDto {
    @ApiProperty({ description: '약관 유형', enum: TermType })
    @IsEnum(TermType)
    type: TermType;

    @ApiProperty({ description: '약관 필수/선택 여부' })
    @IsBoolean()
    isRequired: boolean;

    @ApiProperty({ description: '약관 대상 카테고리', enum: TermTargetCategoryType })
    @IsEnum(TermTargetCategoryType)
    targetCategory: TermTargetCategoryType;

    @ApiProperty({ description: '약관 내용' })
    @IsRequiredString()
    content: string;
}