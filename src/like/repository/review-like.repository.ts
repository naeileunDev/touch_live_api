import { DataSource, DeleteResult, In, LessThan, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ReviewLike } from "../entity/review-like.entity";

@Injectable()
export class ReviewLikeRepository extends Repository<ReviewLike> {
    constructor(private readonly dataSource: DataSource) {
        super(ReviewLike, dataSource.createEntityManager());
    }

    async createReviewLike(userId: number, reviewId: number): Promise<ReviewLike> {
        const entity = this.create({ userId, reviewId });
        await this.save(entity);
        return entity;
    }

    async existsByUserIdAndReviewId(userId: number, reviewId: number): Promise<boolean> {
        return await this.exists({ where: { userId, reviewId } });
    }

    // 삭제 후 복구 위한 메서드
    async existsByUserIdAndReviewIdWithDeleted(userId: number, reviewId: number): Promise<boolean> {
        return await this.exists({ 
            where: { 
                userId, 
                reviewId 
            }, 
            withDeleted: true,
        });
    }

    async deleteByUserIdAndReviewId(userId: number, reviewId: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ userId, reviewId });
        return rtn.affected > 0;
    }
    // 쿼리 빌더가 더 빨라서 해당 메서드 사용 (삭제된 데이터 복구)    
    async restoreByUsersIdFast(userId: number, reviewId: number): Promise<boolean> {
        const result = await this.createQueryBuilder()
            .restore()
            .where('userId = :userId', { userId })
            .andWhere('reviewId = :reviewId', { reviewId })
            .andWhere('deletedAt IS NOT NULL')
            .execute();
        
        return result.affected > 0;
    }

}