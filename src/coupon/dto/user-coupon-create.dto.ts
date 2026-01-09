import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional } from "class-validator";
import { CategoryType } from "src/tag/enum/category-type.enum";
import { DiscountType } from "../enum/coupon.enum";
import { Coupon } from "../entity/coupon.entity";
import { User } from "src/user/entity/user.entity";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class UserCouponCreateDto {
    @ApiProperty({ description: '쿠폰 ID' })
    @IsInt()
    couponId: number;

    @ApiProperty({ description: '쿠폰 번호', example: 'COUPON-uuid' })
    @IsRequiredString()
    couponNo: string;
    
    @ApiProperty({ description: '사용자' })
    user: User;

    @ApiProperty({ description: '사용 여부', default: false })
    @IsBoolean()
    isUsed: boolean = false;

    @ApiProperty({ description: '적용 카테고리 타입', enum: CategoryType, example: CategoryType.Food })
    @IsOptional()
    @IsEnum(CategoryType)
    category?: CategoryType;

    @ApiProperty({ description: '쿠폰 사용 가능 최소 금액', example: 10000, nullable: true })
    @IsOptional()
    @IsInt()
    minOrderAmount?: number;

    @ApiProperty({ description: '쿠폰 할인 최대 금액(퍼센트 쿠폰용)', example: 20000, nullable: true })
    @IsOptional()
    @IsInt()
    maxDiscountAmount?: number;

    @ApiProperty({ description: '쿠폰 만료 일시', example: '2025-01-01 12:00:00', nullable: true })
    @IsOptional()
    @IsDate()
    issuableUntil?: Date;

    @ApiProperty({ description: '쿠폰 유효 일수(일 단위)', example: 30, nullable: true })
    @IsOptional()
    @IsInt()
    validDays?: number;

    @ApiProperty({ description: '할인 금액 또는 퍼센트', example: 10000, nullable: true })
    @IsOptional()
    @IsInt()
    amount?: number;

    @ApiProperty({ description: '할인 타입', enum: DiscountType, example: DiscountType.Amount })
    @IsEnum(DiscountType)
    discountType: DiscountType;

    @ApiPropertyOptional({ description: '쿠폰 사용 만료 일시', nullable: true })
    @IsOptional()
    @IsDate()
    expiresAt?: Date;

    constructor(coupon: Coupon, user: User) {
        this.couponId = coupon.id;
        this.couponNo = coupon.couponNo;
        this.user = user;
        this.isUsed = false;
        this.category = coupon.category;
        this.minOrderAmount = coupon.minOrderAmount;
        this.maxDiscountAmount = coupon.maxDiscountAmount;
        this.issuableUntil = coupon.issuableUntil;
        this.validDays = coupon.validDays;
        this.amount = coupon.amount;
        this.discountType = coupon.discountType;
    }
}