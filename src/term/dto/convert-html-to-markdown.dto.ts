import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TermsType } from "../enum/term-type.enum";

export class ConvertHtmlToMarkdownDto {
    @ApiProperty({ 
        description: 'HTML 내용 (직접 입력)', 
        example: '<p>Hello, world!</p>', 
        required: false 
    })
    @IsOptional()
    @IsString()
    html?: string;

    @ApiProperty({ 
        description: 'HTML 파일 경로 (로컬 파일 시스템 경로)', 
        example: '/Users/nahyerim/naeileun_dev/00_project/00_shoppoing(touch_live)/03_document/00_기획/02_5) 251128 운용정책(html용).html',
        required: false 
    })
    @IsOptional()
    @IsString()
    filePath?: string;

}
