import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { DiscountType } from "../enum/coupon.enum";
import { Coupon } from "../entity/coupon.entity";
import { CategoryType } from "src/tag/enum/category-type.enum";

export class CouponDto {
    @ApiProperty({ description: '쿠폰 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '쿠폰 재고', example: 100 })
    stock: number;

    @ApiProperty({ description: '할인 타입', example: DiscountType.Amount })
    discountType: DiscountType;

    @ApiProperty({ description: '적용 카테고리 타입', example: CategoryType.Food })
    category: CategoryType;

    @ApiProperty({ description: '할인 금액 또는 할인 퍼센트', example: 10000 })
    amount: number;

    @ApiPropertyOptional({ description: '쿠폰 사용 가능 최소 금액', example: 10000, nullable: true })
    @IsOptional()
    minOrderAmount?: number;

    @ApiPropertyOptional({ description: '쿠폰 할인 최대 금액(퍼센트 쿠폰용)', example: 20000, nullable: true })
    @IsOptional()
    maxDiscountAmount?: number;

    @ApiPropertyOptional({ description: '쿠폰 만료 일시', example: '2025-01-01 12:00:00', nullable: true })
    @IsOptional()
    issuableUntil?: Date;

    @ApiProperty({ description: '쿠폰 생성 일시', example: '2025-01-01 12:00:00' })
    createdAt: Date;

    @ApiProperty({ description: '쿠폰 수정 일시', example: '2025-01-01 12:00:00' })
    updatedAt: Date;

    @ApiPropertyOptional({ description: '쿠폰 유효 일수(일 단위)', example: 30, nullable: true })
    @IsOptional()
    validDays?: number;


    @ApiProperty({ description: '쿠폰 번호', example: 'COUPON-uuid' })
    couponNo: string;
    
    constructor(coupon: Coupon) {
        this.id = coupon.id;
        this.stock = coupon.stock;
        this.discountType = coupon.discountType;
        this.category = coupon.category;
        this.amount = coupon.amount;
        this.minOrderAmount = coupon.minOrderAmount;
        this.maxDiscountAmount = coupon.maxDiscountAmount;
        this.issuableUntil = coupon.issuableUntil;
        this.createdAt = coupon.createdAt;
        this.updatedAt = coupon.updatedAt;
        this.validDays = coupon.validDays;
        this.couponNo = coupon.couponNo;
    }

}