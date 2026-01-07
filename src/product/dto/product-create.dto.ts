import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { ProductTargetGender } from "../enum/product-target-gender.enum";
import { ProductTargetAge } from "../enum/product-target-age.enum";
import { ProductOptionCreateDto } from "./product-option-create.dto";
import { Type } from "class-transformer";
import { ProductCategory } from "../entity/product-category.entity";

export class ProductCreateDto {
    @ApiProperty({ description: '상품명' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '가격' })
    @IsNotEmpty()
    @IsString()
    @Min(0)
    price: number;

    @ApiProperty({ description: '구매 대상 성별', enum: ProductTargetGender })
    @IsNotEmpty()
    @IsEnum(ProductTargetGender)
    targetGender: ProductTargetGender;

    @ApiProperty({ description: '구매 대상 나이', enum: ProductTargetAge })
    @IsNotEmpty()
    @IsEnum(ProductTargetAge)
    targetAge: ProductTargetAge;

    @ApiProperty({ description: '할인율' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountValue?: number;

    @ApiProperty({ description: '배송비' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    deliveryFee?: number;

    @ApiProperty({ description: '배송 회사' })
    @IsNotEmpty()
    @IsString()
    deliveryCompany: string;

    @ApiProperty({ description: '배송 기간' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    deliveryPeriod: number;

    @ApiProperty({ description: '최대 결제 횟수' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maxPurchaseLimit?: number;

    @ApiProperty({ description: '활성 여부' })
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({ description: '옵션 여부' })
    @IsNotEmpty()
    @IsBoolean()
    isMixed: boolean;
    
    @ApiProperty({ description: '수량' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock: number;
    
    @ApiProperty({ description: '카테고리 ID' })
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;
    
    charge: number;

    version: Date;

    productCategory: ProductCategory;

    @ApiProperty({ description: '옵션 목록', type: [ProductOptionCreateDto] })
    @IsOptional()
    @IsArray()
    @Type(() => ProductOptionCreateDto)
    options?: ProductOptionCreateDto[];
}