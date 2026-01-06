import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsOptional } from "class-validator";
import { DiscountType } from "../enum/coupon.enum";
import { CategoryType } from "src/tag/enum/category-type.enum";

export class CouponCreateDto {
    @ApiProperty({ description: '쿠폰 재고' })
    @IsInt()
    stock: number;

    @ApiProperty({ description: '할인 타입', enum: DiscountType, example: DiscountType.Amount })
    @IsEnum(DiscountType)
    discountType: DiscountType;

    @ApiPropertyOptional({ description: '쿠폰 타입', enum: CategoryType, nullable: true })
    @IsOptional()
    @IsEnum(CategoryType)
    category?: CategoryType;

    @ApiProperty({ description: '할인 금액 또는 할인 퍼센트', example: 10000 })
    @IsInt()
    amount: number;
    
    @ApiPropertyOptional({ description: '쿠폰 사용 가능 최소 금액', nullable: true })
    @IsOptional()
    @IsInt()
    minOrderAmount?: number;

    @ApiPropertyOptional({ description: '쿠폰 사용 가능 최대 금액', nullable: true })
    @IsOptional()
    @IsInt()
    maxOrderAmount?: number;

    @ApiPropertyOptional({ description: '쿠폰 만료 일시', nullable: true })
    @IsOptional()
    @IsDate()
    expireAt?: Date;
}