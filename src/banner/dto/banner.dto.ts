import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BannerPosition, BannerLinkType } from 'src/common/enums';

export class CreateBannerDto {
    @ApiProperty({ description: '파일 ID' })
    @IsInt()
    fileId: number;

    @ApiProperty({ description: '배너 위치', enum: BannerPosition })
    @IsEnum(BannerPosition)
    position: BannerPosition;

    @ApiPropertyOptional({ description: '배너 제목' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiPropertyOptional({ description: '링크 타입', enum: BannerLinkType })
    @IsOptional()
    @IsEnum(BannerLinkType)
    linkType?: BannerLinkType;

    @ApiPropertyOptional({ description: '링크 URL' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    linkUrl?: string;

    @ApiPropertyOptional({ description: '링크 대상 ID' })
    @IsOptional()
    @IsInt()
    linkTargetId?: number;

    @ApiPropertyOptional({ description: '노출 순서', default: 0 })
    @IsOptional()
    @IsInt()
    displayOrder?: number;

    @ApiPropertyOptional({ description: '활성화 여부', default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: '노출 시작일' })
    @IsOptional()
    @IsDateString()
    startAt?: string;

    @ApiPropertyOptional({ description: '노출 종료일' })
    @IsOptional()
    @IsDateString()
    endAt?: string;
}

export class UpdateBannerDto {
    @ApiPropertyOptional({ description: '파일 ID' })
    @IsOptional()
    @IsInt()
    fileId?: number;

    @ApiPropertyOptional({ description: '배너 위치', enum: BannerPosition })
    @IsOptional()
    @IsEnum(BannerPosition)
    position?: BannerPosition;

    @ApiPropertyOptional({ description: '배너 제목' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiPropertyOptional({ description: '링크 타입', enum: BannerLinkType })
    @IsOptional()
    @IsEnum(BannerLinkType)
    linkType?: BannerLinkType;

    @ApiPropertyOptional({ description: '노출 순서' })
    @IsOptional()
    @IsInt()
    displayOrder?: number;

    @ApiPropertyOptional({ description: '활성화 여부' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
