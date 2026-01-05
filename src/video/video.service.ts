import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoViewLog, VideoLike, VideoComment, VideoCommentLike } from './entity/video.entity';
import { CreateVideoViewLogDto, UpdateVideoViewLogDto, ToggleVideoLikeDto, CreateVideoCommentDto, UpdateVideoCommentDto } from './dto/video.dto';
import { VideoTargetType } from 'src/common/enums';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(VideoViewLog)
        private readonly viewLogRepository: Repository<VideoViewLog>,
        @InjectRepository(VideoLike)
        private readonly likeRepository: Repository<VideoLike>,
        @InjectRepository(VideoComment)
        private readonly commentRepository: Repository<VideoComment>,
        @InjectRepository(VideoCommentLike)
        private readonly commentLikeRepository: Repository<VideoCommentLike>,
    ) {}

    // === 시청 기록 ===
    async createViewLog(userId: number, dto: CreateVideoViewLogDto): Promise<VideoViewLog> {
        const viewLog = this.viewLogRepository.create({
            userId,
            targetType: dto.targetType,
            targetId: dto.targetId,
        });
        return this.viewLogRepository.save(viewLog);
    }

    async updateViewLog(id: number, dto: UpdateVideoViewLogDto): Promise<VideoViewLog> {
        const viewLog = await this.viewLogRepository.findOne({ where: { id } });
        if (!viewLog) {
            throw new NotFoundException('시청 기록을 찾을 수 없습니다.');
        }
        Object.assign(viewLog, dto);
        return this.viewLogRepository.save(viewLog);
    }

    async getViewHistory(userId: number, targetType?: VideoTargetType, page = 1, limit = 20) {
        const qb = this.viewLogRepository
            .createQueryBuilder('vl')
            .where('vl.userId = :userId', { userId });

        if (targetType) {
            qb.andWhere('vl.targetType = :targetType', { targetType });
        }

        const [items, total] = await qb
            .orderBy('vl.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { items, total, page, limit };
    }

    // === 좋아요 ===
    async toggleLike(userId: number, dto: ToggleVideoLikeDto): Promise<{ liked: boolean }> {
        const existing = await this.likeRepository.findOne({
            where: {
                userId,
                targetType: dto.targetType,
                targetId: dto.targetId,
            },
        });

        if (existing) {
            await this.likeRepository.remove(existing);
            return { liked: false };
        }

        const like = this.likeRepository.create({
            userId,
            targetType: dto.targetType,
            targetId: dto.targetId,
        });
        await this.likeRepository.save(like);
        return { liked: true };
    }

    async isLiked(userId: number, targetType: VideoTargetType, targetId: number): Promise<boolean> {
        const count = await this.likeRepository.count({
            where: { userId, targetType, targetId },
        });
        return count > 0;
    }

    async getLikeCount(targetType: VideoTargetType, targetId: number): Promise<number> {
        return this.likeRepository.count({
            where: { targetType, targetId },
        });
    }

    // === 댓글 ===
    async createComment(userId: number, dto: CreateVideoCommentDto): Promise<VideoComment> {
        const comment = this.commentRepository.create({
            userId,
            targetType: dto.targetType,
            targetId: dto.targetId,
            content: dto.content,
        });
        return this.commentRepository.save(comment);
    }

    async getComments(targetType: VideoTargetType, targetId: number, page = 1, limit = 20) {
        const [items, total] = await this.commentRepository.findAndCount({
            where: { targetType, targetId, deletedAt: null },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items, total, page, limit };
    }

    async updateComment(id: number, userId: number, dto: UpdateVideoCommentDto): Promise<VideoComment> {
        const comment = await this.commentRepository.findOne({
            where: { id, userId, deletedAt: null },
        });

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }

        Object.assign(comment, dto);
        return this.commentRepository.save(comment);
    }

    async deleteComment(id: number, userId: number): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id, userId, deletedAt: null },
        });

        if (!comment) {
            throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }

        comment.deletedAt = new Date();
        await this.commentRepository.save(comment);
    }

    async getCommentCount(targetType: VideoTargetType, targetId: number): Promise<number> {
        return this.commentRepository.count({
            where: { targetType, targetId, deletedAt: null },
        });
    }

    // === 댓글 좋아요 ===
    async toggleCommentLike(userId: number, commentId: number): Promise<{ liked: boolean }> {
        const existing = await this.commentLikeRepository.findOne({
            where: { userId, commentId },
        });

        if (existing) {
            await this.commentLikeRepository.remove(existing);
            await this.commentRepository.decrement({ id: commentId }, 'likeCount', 1);
            return { liked: false };
        }

        const like = this.commentLikeRepository.create({ userId, commentId });
        await this.commentLikeRepository.save(like);
        await this.commentRepository.increment({ id: commentId }, 'likeCount', 1);
        return { liked: true };
    }
}
