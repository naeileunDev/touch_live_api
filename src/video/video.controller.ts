import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { CreateVideoViewLogDto, UpdateVideoViewLogDto, ToggleVideoLikeDto, CreateVideoCommentDto, UpdateVideoCommentDto } from './dto/video.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { VideoTargetType } from 'src/common/enums';

@ApiTags('Video')
@Controller('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

    // === 시청 기록 ===
    @Post('view')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '시청 기록 생성' })
    async createViewLog(
        @GetUser('id') userId: number,
        @Body() dto: CreateVideoViewLogDto,
    ) {
        return this.videoService.createViewLog(userId, dto);
    }

    @Put('view/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '시청 기록 업데이트' })
    async updateViewLog(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateVideoViewLogDto,
    ) {
        return this.videoService.updateViewLog(id, dto);
    }

    @Get('view/history')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '시청 기록 조회' })
    async getViewHistory(
        @GetUser('id') userId: number,
        @Query('targetType') targetType?: VideoTargetType,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.videoService.getViewHistory(userId, targetType, page, limit);
    }

    // === 좋아요 ===
    @Post('like')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '좋아요 토글' })
    async toggleLike(
        @GetUser('id') userId: number,
        @Body() dto: ToggleVideoLikeDto,
    ) {
        return this.videoService.toggleLike(userId, dto);
    }

    @Get('like/check')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '좋아요 여부 확인' })
    async checkLike(
        @GetUser('id') userId: number,
        @Query('targetType') targetType: VideoTargetType,
        @Query('targetId', ParseIntPipe) targetId: number,
    ) {
        const liked = await this.videoService.isLiked(userId, targetType, targetId);
        return { liked };
    }

    @Get('like/count')
    @ApiOperation({ summary: '좋아요 수 조회' })
    async getLikeCount(
        @Query('targetType') targetType: VideoTargetType,
        @Query('targetId', ParseIntPipe) targetId: number,
    ) {
        const count = await this.videoService.getLikeCount(targetType, targetId);
        return { count };
    }

    // === 댓글 ===
    @Post('comments')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '댓글 작성' })
    async createComment(
        @GetUser('id') userId: number,
        @Body() dto: CreateVideoCommentDto,
    ) {
        return this.videoService.createComment(userId, dto);
    }

    @Get('comments')
    @ApiOperation({ summary: '댓글 목록 조회' })
    async getComments(
        @Query('targetType') targetType: VideoTargetType,
        @Query('targetId', ParseIntPipe) targetId: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.videoService.getComments(targetType, targetId, page, limit);
    }

    @Put('comments/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '댓글 수정' })
    async updateComment(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number,
        @Body() dto: UpdateVideoCommentDto,
    ) {
        return this.videoService.updateComment(id, userId, dto);
    }

    @Delete('comments/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '댓글 삭제' })
    async deleteComment(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number,
    ) {
        return this.videoService.deleteComment(id, userId);
    }

    // === 댓글 좋아요 ===
    @Post('comments/:commentId/like')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '댓글 좋아요 토글' })
    async toggleCommentLike(
        @Param('commentId', ParseIntPipe) commentId: number,
        @GetUser('id') userId: number,
    ) {
        return this.videoService.toggleCommentLike(userId, commentId);
    }
}
