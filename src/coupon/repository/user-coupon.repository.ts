import { DataSource, DeleteResult, Repository } from "typeorm";
import { UserCoupon } from "../entity/user-coupon.entity";
import { Injectable } from "@nestjs/common";
import { UserCouponCreateDto } from "../dto/user-coupon-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";

@Injectable()
export class UserCouponRepository extends Repository<UserCoupon> {
    constructor(private dataSource: DataSource) {
        super(UserCoupon, dataSource.createEntityManager());
    }

    async createUserCoupon(userCouponCreateDto: UserCouponCreateDto): Promise<UserCoupon> {
        const userCoupon = this.create(userCouponCreateDto);
        return await this.save(userCoupon);
    }

    async findById(id: number): Promise<UserCoupon> {
        const userCoupon = await this.findOne({ 
            where: { id },
            relations: ['user', 'coupon'],
        });
        if (!userCoupon) {
            throw new ServiceException(MESSAGE_CODE.USER_COUPON_NOT_FOUND);
        }
        return userCoupon;
    }

    async deleteById(id: number): Promise<boolean> {
        await this.findById(id);
        const rtn: DeleteResult = await this.softDelete({ 
            id,
        });
        return rtn.affected > 0;
    }

    async findByUserId(publicId: string, pagination?: PaginationDto, isUsed?: boolean | undefined): Promise<{coupons: UserCoupon[], total: number}> {
        const { page, limit } = pagination;
        const where: any = {
            user: { publicId },
        };
        // isUsed 파라미터가 제공되면 필터링
        if (isUsed !== undefined) {
            where.isUsed = isUsed;
        }
        const [coupons, total] = await this.findAndCount({ 
            where,
            relations: ['user', 'coupon'],
            skip: (page - 1) * limit,
            take: limit,
        });
        return { coupons, total };
    }

    /**
     * 만료일 기준 일주일 지난 쿠폰 삭제 (사용된 쿠폰은 제외)
     * DB에서 직접 조건에 맞는 쿠폰만 삭제하여 성능 최적화
     * @param oneWeekAgo 일주일 전 날짜
     * @returns 삭제된 쿠폰 수
     */
    async deleteExpired(oneWeekAgo: Date): Promise<number> {
        const result = await this.createQueryBuilder()
            .softDelete()
            .where('expiresAt IS NOT NULL AND expiresAt < :oneWeekAgo', { 
                oneWeekAgo 
            })
            .andWhere('isUsed = :isUsed', { isUsed: false })
            .execute();
        
        return result.affected || 0;
    }

    async findAll(): Promise<UserCoupon[]> {
        return await this.find({
            relations: ['user', 'coupon'],
        });
    }
}