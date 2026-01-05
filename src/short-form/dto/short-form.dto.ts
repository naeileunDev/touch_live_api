import { IsArray, IsInt, IsOptional, IsString, MaxLength, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShortFormDto {
    @ApiProperty({ description: '썸네일 파일 ID' })
    @IsInt()
    thumbnailFileId: number;

    @ApiProperty({ description: '제품 영상 파일 ID' })
    @IsInt()
    videoFileId: number;

    @ApiProperty({ description: '백색 영상 파일 ID' })
    @IsInt()
    whiteVideoFileId: number;

    @ApiProperty({ description: '제목' })
    @IsString()
    @MaxLength(100)
    title: string;

    @ApiProperty({ description: '해시태그 ID 배열 (1~3개)' })
    @IsArray()
    @IsInt({ each: true })
    tagIds: number[];

    @ApiProperty({ description: '상품 태그 ID 배열 (제한 없음)' })
    @IsArray()
    @IsInt({ each: true })
    productIds: number[];

    @ApiPropertyOptional({ description: '영상 길이 (초)' })
    @IsOptional()
    @IsInt()
    duration?: number;
}

export class UpdateShortFormDto {
    @ApiPropertyOptional({ description: '썸네일 파일 ID' })
    @IsOptional()
    @IsInt()
    thumbnailFileId?: number;

    @ApiPropertyOptional({ description: '제품 영상 파일 ID' })
    @IsOptional()
    @IsInt()
    videoFileId?: number;

    @ApiPropertyOptional({ description: '백색 영상 파일 ID' })
    @IsOptional()
    @IsInt()
    whiteVideoFileId?: number;

    @ApiPropertyOptional({ description: '제목' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiPropertyOptional({ description: '해시태그 ID 배열' })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    tagIds?: number[];

    @ApiPropertyOptional({ description: '상품 태그 ID 배열' })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    productIds?: number[];

    @ApiPropertyOptional({ description: '활성화 여부' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class ShortFormListQueryDto {
    @ApiPropertyOptional({ description: '스토어 ID' })
    @IsOptional()
    @IsInt()
    storeId?: number;

    @ApiPropertyOptional({ description: '태그 ID' })
    @IsOptional()
    @IsInt()
    tagId?: number;

    @ApiPropertyOptional({ description: '페이지', default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: '페이지 크기', default: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;
}
