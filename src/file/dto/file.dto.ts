import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ContentCategory, MediaType, UsageType, MimeType } from "../enum/file-category.enum";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class FileDto {

    @ApiProperty({ description: '파일 식별자', example: 1, type: Number })
    @IsNumber()
    @IsOptional()
    id?: number;

    @ApiProperty({ description: '콘텐츠 카테고리', example: ContentCategory.User, enum: ContentCategory })
    @IsEnum(ContentCategory)
    contentCategory: ContentCategory;
    
    @ApiProperty({ description: '미디어 타입', example: MediaType.Image, enum: MediaType })
    @IsEnum(MediaType)
    mediaType: MediaType;

    @ApiProperty({ description: 'mime 타입', example: MimeType.Jpeg, enum: MimeType })
    @IsEnum(MimeType)
    mimeType: MimeType;

    @ApiProperty({ description: '파일 사용 용도', example: UsageType.Profile, enum: UsageType })
    @IsEnum(UsageType)
    usageType: UsageType;

    @ApiProperty({ description: '파일 원래 이름', example: 'test.jpg' })
    @IsString()
    originalName: string;
    
    @ApiProperty({ description: '파일 경로', example: 'https://example.com/test.jpg' })
    @IsString()
    fileUrl: string;

    @ApiProperty({ description: '영상 길이', example: 100 })
    @IsNumber()
    duration: number;

    @ApiPropertyOptional({ description: '콘텐츠 타입', example: 1, type: Number })
    @IsOptional()
    @IsNumber()
    contentId?: number;

    @ApiProperty({ description: '유저 ID', example: 1, type: Number })
    @IsNumber()
    userId: number;

    @ApiProperty({ description: '필드 이름', example: 'thumbnailImage or 블랙/m 등', type: String })
    @IsString()
    @IsOptional()
    field?: string;

    constructor(data:FileDto, field?: string) {
        if (data) {
            Object.assign(this, data);
        }
        this.field = field;
    }
}