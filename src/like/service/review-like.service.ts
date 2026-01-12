import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/service/user.service";
import { ReviewLikeRepository } from "../repository/review-like.repository";

@Injectable()
export class ReviewLikeService {
    constructor(
        private readonly reviewLikeRepository: ReviewLikeRepository,
        private readonly userService: UserService,
    ) {
        }

    async isLiked(userId: string, reviewId: number): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(userId);
        return await this.reviewLikeRepository.existsByUserIdAndReviewId(user.id, reviewId);
    }

    async likeAndUnlike(userId: string, reviewId: number): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(userId);
        const existing = await this.reviewLikeRepository.existsByUserIdAndReviewId(user.id, reviewId);
        if (existing) {
            return await this.reviewLikeRepository.deleteByUserIdAndReviewId(user.id, reviewId);
        }
        const deleted = await this.reviewLikeRepository.existsByUserIdAndReviewIdWithDeleted(user.id, reviewId);
        if (deleted) {
            return await this.reviewLikeRepository.restoreByUsersIdFast(user.id, reviewId);
        }
        await this.reviewLikeRepository.createReviewLike(user.id, reviewId);
        return true;
    }

    async findCountLikes(reviewId: number): Promise<number> {
        return await this.reviewLikeRepository.count({ where: { reviewId } });
    }

}