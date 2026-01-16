import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ContentCategory, UsageType } from "../enum/file-category.enum";
import { Expose, Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class FileCreateDto {
    @ApiProperty({ 
        description: '콘텐츠 카테고리', 
        example: ContentCategory.User, 
        enum: ContentCategory,
    })
    @IsEnum(ContentCategory)
    contentCategory: ContentCategory;
    
    @ApiProperty({ description: '파일 사용 용도', example: UsageType.Profile, enum: UsageType })
    @IsEnum(UsageType)
    usageType: UsageType;

    @ApiPropertyOptional({ description: '콘텐츠 타입', example: 1, type: Number })
    @IsOptional()
    @IsNumber()
    contentId?: number;

    @ApiPropertyOptional({ description: '필드 이름', example: 'thumbnailImage or 블랙/m 등', type: String })
    @IsOptional()
    @IsRequiredString()
    field?: string;

    constructor(
        contentCategory: ContentCategory, 
        usageType: UsageType, 
        contentId?: number, 
        field?: string,
    ) {
        this.contentCategory = contentCategory;
        this.usageType = usageType;
        this.contentId = contentId;
        this.field = field;
    }
}