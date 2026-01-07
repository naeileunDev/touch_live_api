import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsOptional } from "class-validator";
import { CategoryType } from "src/tag/enum/category-type.enum";

export class CouponUpdateDto {

    @ApiPropertyOptional({ description: '적용 카테고리 타입', enum: CategoryType, example: CategoryType.Food })
    @IsOptional()
    @IsEnum(CategoryType)
    category?: CategoryType;

    @ApiPropertyOptional({ description: '쿠폰 할인 최대 금액(퍼센트 쿠폰용)' })
    @IsOptional()
    @IsInt()
    maxDiscountAmount?: number;

    @ApiPropertyOptional({ description: '쿠폰 사용 가능 최소 금액' })
    @IsOptional()
    @IsInt()
    minOrderAmount?: number;

    @ApiPropertyOptional({ description: '쿠폰 만료 일시' })
    @IsOptional()
    @IsDate()
    issuableUntil?: Date;

    @ApiPropertyOptional({ description: '할인 금액 또는 퍼센트 ' })
    @IsOptional()
    @IsInt()
    amount?: number;

}