import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { CommentLikeRepository } from '../repository/comment-like.repository';
import { CommentService } from 'src/comment/comment.service';

/* ToDo: 해당 댓글 유무 확인 로직 추가  */

@Injectable()
export class CommentLikeService {
    constructor(
        private readonly commentLikeRepository: CommentLikeRepository,
        private readonly userService: UserService,
        private readonly commentService: CommentService,
    ) {}

    /**  
     * 해당 유저가 해당 제품을 좋아요 했는지 확인
     * @param userId 유저 ID
     * @param commentId 댓글 ID
     * @returns boolean
     */
    async isLiked(userId: string, commentId: number): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(userId);
        // const comment = await this.commentService.findEntityById(commentId);
        return await this.commentLikeRepository.existsByUserIdAndCommentId(user.id, commentId);
    }

    // 이미 좋아요 되있으면 좋아요 취소, 없으면 좋아요 
    async likeAndUnlike(userId: string, commentId: number): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(userId);
        // const product = await this.productService.findEntityById(productId);
        const existing = await this.commentLikeRepository.existsByUserIdAndCommentId(user.id, commentId);
        if (existing) {
            return await this.commentLikeRepository.deleteByUserIdAndCommentId(user.id, commentId);
        }
        const deleted = await this.commentLikeRepository.existsByUserIdAndCommentIdWithDeleted(user.id, commentId);
        if (deleted) {
            return await this.commentLikeRepository.restoreByUsersIdFast(user.id, commentId);
        }
        await this.commentLikeRepository.createCommentLike(user.id, commentId);
        return true;
    }

    // 해당 제품을 좋아하는 유저 수 return
    async findCountLikes(commentId: number): Promise<number> {
        return await this.commentLikeRepository.count({ where: { commentId } });

    }
}