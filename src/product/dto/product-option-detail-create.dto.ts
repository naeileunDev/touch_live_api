import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ProductOption } from "../entity/product-option.entity";

export class ProductOptionDetailCreateDto {
    @ApiProperty({ description: '옵션 상세명' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '수량' })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    version: Date;

    productOption: ProductOption;
}