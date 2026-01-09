import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { DiscountType } from "../enum/coupon.enum";
import { CategoryType } from "src/tag/enum/category-type.enum";
import { UserCoupon } from "../entity/user-coupon.entity";

export class UserCouponDto {
    @ApiProperty({ description: 'id', example: 1 })
    id: number;

    @ApiProperty({ description: '쿠폰 ID', example: 1 })
    couponId: number;

    @ApiProperty({ description: '쿠폰 번호', example: 'COUPON-uuid' })
    couponNo: string;

    @ApiPropertyOptional({ description: '할인 타입', example: DiscountType.Amount, nullable: true })
    @IsOptional()
    discountType?: DiscountType;

    @ApiPropertyOptional({ description: '적용 카테고리 타입', enum: CategoryType, nullable: true })
    @IsOptional()
    category?: CategoryType;

    @ApiPropertyOptional({ description: '할인 금액 또는 할인 퍼센트', example: 10000, nullable: true })
    @IsOptional()
    amount?: number;

    @ApiPropertyOptional({ description: '쿠폰 사용 가능 최소 금액', example: 10000, nullable: true })
    @IsOptional()
    minOrderAmount?: number;

    @ApiPropertyOptional({ description: '쿠폰 할인 최대 금액(퍼센트 쿠폰용)', example: 20000, nullable: true })
    @IsOptional()
    maxDiscountAmount?: number;

    @ApiPropertyOptional({ description: '쿠폰 유효 일수', example: 30, nullable: true })
    @IsOptional()
    validDays?: number;

    @ApiProperty({ description: '쿠폰 생성 일시(발급일시)', example: '2025-01-01 12:00:00' })
    createdAt: Date;

    @ApiProperty({ description: '쿠폰 수정 일시', example: '2025-01-01 12:00:00' })
    updatedAt: Date;

    @ApiProperty({ description: '사용 여부', example: false })
    isUsed: boolean;

    @ApiPropertyOptional({ description: '쿠폰 사용 만료 일시(발급일시 + 유효 일수)', example: '2025-01-01 12:00:00', nullable: true })
    @IsOptional()
    expiresAt?: Date;

    constructor(userCoupon: UserCoupon) {
        this.id = userCoupon.id;
        this.couponId = userCoupon.couponId;
        this.couponNo = userCoupon.couponNo;
        this.discountType = userCoupon.discountType;
        this.category = userCoupon.category;
        this.amount = userCoupon.amount;
        this.minOrderAmount = userCoupon.minOrderAmount;
        this.maxDiscountAmount = userCoupon.maxDiscountAmount;
        this.expiresAt = userCoupon.expiresAt;
        this.validDays = userCoupon.validDays;
        this.createdAt = userCoupon.createdAt;
        this.updatedAt = userCoupon.updatedAt;
        this.isUsed = userCoupon.isUsed;
    }
}