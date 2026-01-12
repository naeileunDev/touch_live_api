import { DataSource, DeleteResult, LessThan, MoreThan, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductLike } from "../entity/product-like.entity";

@Injectable()
export class ProductLikeRepository extends Repository<ProductLike> {
    constructor(private dataSource: DataSource) {
        super(ProductLike, dataSource.createEntityManager());
    }

    async createProductLike(userId: number, productId: number): Promise<ProductLike> {
        const entity = this.create({ userId, productId });
        await this.save(entity);
        return entity;
    }

    async existsByUserIdAndProductId(userId: number, productId: number): Promise<boolean> {
        return await this.exists({ where: { userId, productId } });
    }

    // 삭제 후 복구 위한 메서드
    async existsByUserIdAndProductIdWithDeleted(userId: number, productId: number): Promise<boolean> {
        return await this.exists({ 
            where: { 
                userId, 
                productId 
            }, 
            withDeleted: true,
        });
    }

    async deleteByUserIdAndProductId(userId: number, productId: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ userId, productId });
        return rtn.affected > 0;
    }
    // 쿼리 빌더가 더 빨라서 해당 메서드 사용 (삭제된 데이터 복구)    
    async restoreByUsersIdFast(userId: number, productId: number): Promise<boolean> {
        const result = await this.createQueryBuilder()
            .restore()
            .where('userId = :userId', { userId })
            .andWhere('productId = :productId', { productId })
            .andWhere('deletedAt IS NOT NULL')
            .execute();
        
        return result.affected > 0;
    }

}