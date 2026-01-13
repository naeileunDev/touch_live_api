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

    @ApiProperty({ description: '콘텐츠 타입', example: 1, type: Number })
    @IsNumber()
    contentId: number;

    @ApiProperty({ description: '유저 ID', example: 1, type: Number })
    @IsNumber()
    userId: number;

    constructor(contentCategory: ContentCategory, usageType: UsageType, contentId?: number, userId?: number) {
        this.contentCategory = contentCategory;
        this.usageType = usageType;
        this.contentId = contentId;
        this.userId = userId;
    }
}