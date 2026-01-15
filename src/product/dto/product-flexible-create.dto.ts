import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entity/product.entity";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Column, ManyToOne } from "typeorm";
import { ProductTargetGender } from "../enum/product-target-gender.enum";
import { ProductTargetAge } from "../enum/product-target-age.enum";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class ProductFlexibleCreateDto {

    @ApiProperty({ description: '재고(단일 옵션시)', type: Number, nullable: true })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiProperty({ description: '상품명', example: '상품명' })
    @IsRequiredString()
    name: string;

    @ApiProperty({ description: '가격', type: Number, example: 10000 })
    @IsNumber()
    price: number;

    @ApiProperty({ description: '구매 대상 성별', enum: ProductTargetGender, example: ProductTargetGender.Male })
    @IsEnum(ProductTargetGender)
    targetGender: ProductTargetGender;

    @ApiProperty({ description: '구매 대상 나이', enum: ProductTargetAge, example: ProductTargetAge.Adult })
    @IsEnum(ProductTargetAge)
    targetAge: ProductTargetAge;

    @ApiProperty({ description: '할인 가격', type: Number, nullable: true })
    @IsOptional()
    @IsNumber()
    discountValue?: number;

    @ApiProperty({ description: '배송비', type: Number, example: 1000 })
    @IsNumber()
    deliveryFee: number;

    @ApiProperty({ description: '배송 회사', example: '배송 회사' })
    @IsRequiredString()
    deliveryCompany: string;

    @ApiProperty({ description: '배송 기간', example: '3일 ~ 4일 소요'})
    @IsRequiredString()
    deliveryPeriod: string;

    @ApiProperty({ description: '제주도 배송비', type: Number, example: 0 })
    @IsNumber()
    jejuDeliveryFee: number;

    @ApiProperty({ description: '도서산간 배송비', type: Number, example: 0 })
    @IsNumber()
    islandDeliveryFee: number;

    @ApiProperty({ description: '수수료', type: Number, example: 1000 })
    @IsNumber()
    charge: number;

    @Column({ type: 'varchar', comment: '해당 상품 고시 정보' })
    reqInfo: string;

    @ApiProperty({ description: '해시 태그(최소 1개, 최대 3개까지)', example: ['해시 태그1', '해시 태그2', '해시 태그3'] })
    @IsArray()
    @IsString({ each: true })
    tags: string[];

}