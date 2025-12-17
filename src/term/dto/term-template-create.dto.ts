import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsString, ValidateNested } from "class-validator";
import { TermsType } from "../enum/terms-type.enum";
import { ConvertHtmlToMarkdownDto } from "./convert-html-to-markdown.dto";
import { Type } from "class-transformer";

export class TermTemplateCreateDto {
    @ApiProperty({ description: '약관 유형', enum: TermsType })
    @IsEnum(TermsType)
    type: TermsType;

    @ApiProperty({ description: '약관 필수/선택 여부' })
    @IsBoolean()
    isRequired: boolean;

    @ApiProperty({ description: 'HTML을 Markdown으로 변환할 때 사용하는 DTO, 약관 내용이 될 DTO' })
    @Type(() => ConvertHtmlToMarkdownDto)
    @ValidateNested()
    cotent?: ConvertHtmlToMarkdownDto;
}