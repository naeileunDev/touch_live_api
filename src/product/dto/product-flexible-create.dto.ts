import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class ProductFlexibleCreateDto {
    @ApiProperty({ description: '재고', example: 10 })
    @IsNumber()
    stock: number;

    @ApiProperty({ description: '배송비', example: 1000 })
    @IsNumber()
    deliveryFee: number;

    @ApiProperty({ description: '배송 회사', example: '우체국택배' })
    @IsRequiredString()
    deliveryCompany: string;

    @ApiProperty({ description: '배송 기간', example: '3일 ~ 4일 소요' })
    @IsRequiredString()
    deliveryPeriod: string;

    @ApiProperty({ description: '제주도 배송비', example: 1000 })
    @IsNumber()
    jejuDeliveryFee: number;

    @ApiProperty({ description: '도서산간 배송비', example: 1000 })
    @IsNumber()
    islandDeliveryFee: number;

    @ApiProperty({ description: '버전', example: new Date() })
    @IsDate()
    @Type(() => Date)
    version: Date = new Date();
    
}