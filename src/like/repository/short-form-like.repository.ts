import { DataSource, DeleteResult, In, LessThan, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ShortFormLike } from "../entity/short-form-like.entity";

@Injectable()
export class ShortFormLikeRepository extends Repository<ShortFormLike> {
    constructor(private readonly dataSource: DataSource) {
        super(ShortFormLike, dataSource.createEntityManager());
    }

    async createShortFormLike(userId: number, shortFormId: number): Promise<ShortFormLike> {
        const entity = this.create({ userId, shortFormId });
        await this.save(entity);
        return entity;
    }

    async existsByUserIdAndShortFormId(userId: number, shortFormId: number): Promise<boolean> {
        return await this.exists({ where: { userId, shortFormId } });
    }

    // 삭제 후 복구 위한 메서드
    async existsByUserIdAndShortFormIdWithDeleted(userId: number, shortFormId: number): Promise<boolean> {
        return await this.exists({ 
            where: { 
                userId, 
                shortFormId 
            }, 
            withDeleted: true,
        });
    }

    async deleteByUserIdAndShortFormId(userId: number, shortFormId: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({ userId, shortFormId });
        return rtn.affected > 0;
    }
    // 쿼리 빌더가 더 빨라서 해당 메서드 사용 (삭제된 데이터 복구)    
    async restoreByUsersIdFast(userId: number, shortFormId: number): Promise<boolean> {
        const result = await this.createQueryBuilder()
            .restore()
            .where('userId = :userId', { userId })
            .andWhere('shortFormId = :shortFormId', { shortFormId })
            .andWhere('deletedAt IS NOT NULL')
            .execute();
        
        return result.affected > 0;
    }

}