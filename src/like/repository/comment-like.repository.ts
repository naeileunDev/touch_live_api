import { DataSource, DeleteResult, LessThan, MoreThan, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductLike } from "../entity/product-like.entity";
import { CommentLike } from "../entity/comment-like.entity";

@Injectable()
export class CommentLikeRepository extends Repository<CommentLike> {
    constructor(private dataSource: DataSource) {
        super(CommentLike, dataSource.createEntityManager());
    }

    async createCommentLike(userId: number, commentId: number): Promise<CommentLike> {
        const entity = this.create({ userId, commentId });
        await this.save(entity);
        return entity;
    }

    async existsByUserIdAndCommentId(userId: number, commentId: number): Promise<boolean> {
        return await this.exists({ where: { userId, commentId } });
    }

    // 삭제 후 복구 위한 메서드
    async existsByUserIdAndCommentIdWithDeleted(userId: number, commentId: number): Promise<boolean> {
        return await this.exists({ 
            where: { 
                userId, 
                commentId 
            }, 
            withDeleted: true,
        });
    }

    async deleteByUserIdAndCommentId(userId: number, commentId: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ userId, commentId });
        return rtn.affected > 0;
    }
    // 쿼리 빌더가 더 빨라서 해당 메서드 사용 (삭제된 데이터 복구)    
    async restoreByUsersIdFast(userId: number, commentId: number): Promise<boolean> {
        const result = await this.createQueryBuilder()
            .restore()
            .where('userId = :userId', { userId })
            .andWhere('commentId = :commentId', { commentId })
            .andWhere('deletedAt IS NOT NULL')
            .execute();
        
        return result.affected > 0;
    }

}