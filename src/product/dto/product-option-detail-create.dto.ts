import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { ProductOption } from "../entity/product-option.entity";
import { Type } from "class-transformer";

export class ProductOptionDetailCreateDto {
    @ApiProperty({ description: '옵션 상세명' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '수량' })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ description: '옵션', type: ProductOption })
    @ValidateNested()
    @Type(() => ProductOption)
    productOption: ProductOption;
}