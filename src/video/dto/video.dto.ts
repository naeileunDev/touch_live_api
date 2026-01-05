import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VideoTargetType } from 'src/common/enums';

export class CreateVideoViewLogDto {
    @ApiProperty({ description: '대상 타입', enum: VideoTargetType })
    @IsEnum(VideoTargetType)
    targetType: VideoTargetType;

    @ApiProperty({ description: '대상 ID' })
    @IsInt()
    targetId: number;
}

export class UpdateVideoViewLogDto {
    @ApiPropertyOptional({ description: '시청 시간(초)' })
    @IsOptional()
    @IsInt()
    @Min(0)
    watchDuration?: number;

    @ApiPropertyOptional({ description: '완료 여부' })
    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;
}

export class ToggleVideoLikeDto {
    @ApiProperty({ description: '대상 타입', enum: VideoTargetType })
    @IsEnum(VideoTargetType)
    targetType: VideoTargetType;

    @ApiProperty({ description: '대상 ID' })
    @IsInt()
    targetId: number;
}

export class CreateVideoCommentDto {
    @ApiProperty({ description: '대상 타입', enum: VideoTargetType })
    @IsEnum(VideoTargetType)
    targetType: VideoTargetType;

    @ApiProperty({ description: '대상 ID' })
    @IsInt()
    targetId: number;

    @ApiProperty({ description: '댓글 내용' })
    @IsString()
    @MaxLength(500)
    content: string;
}

export class UpdateVideoCommentDto {
    @ApiPropertyOptional({ description: '댓글 내용' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    content?: string;
}
