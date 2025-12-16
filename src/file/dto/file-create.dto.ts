import { ApiProperty } from "@nestjs/swagger";
import { ContentCategory, UsageType } from "../enum/file-category.enum";
import { Expose } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

export class FileCreateDto {
    @Expose()
    @ApiProperty({ description: '콘텐츠 카테고리', example: ContentCategory.User, enum: ContentCategory })
    @IsEnum(ContentCategory)
    contentCategory: ContentCategory;

    @ApiProperty({ description: '파일 사용 용도', example: UsageType.Profile, enum: UsageType })
    @IsEnum(UsageType)
    usageType: UsageType;

    @ApiProperty({ description: '콘텐츠 타입', example: 1, type: Number, nullable: true })
    @IsNumber()
    @IsOptional()
    contentId?: number;
}