import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entity/product.entity";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ProductOptionDetailCreateDto } from "./product-option-detail-create.dto";
import { Type } from "class-transformer";

export class ProductOptionCreateDto {
    @ApiProperty({ description: '옵션명' })
    @IsNotEmpty()
    @IsString()
    name: string;

    product: Product;

    @ApiProperty({ description: '옵션 상세 목록', type: [ProductOptionDetailCreateDto] })
    @IsOptional()
    @IsArray()
    @Type(() => ProductOptionDetailCreateDto)
    optionDetails?: ProductOptionDetailCreateDto[];
}