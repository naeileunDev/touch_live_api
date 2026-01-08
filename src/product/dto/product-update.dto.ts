import { ApiProperty } from "@nestjs/swagger";
import { ProductOptionUpdateDto } from "./product-option-update.dto";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ProductUpdateDto {
    @ApiProperty({ description: '상품명', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: '가격', required: false })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty({ description: '수량', required: false })
    @IsOptional()   
    @IsNumber()
    stock?: number;

    @ApiProperty({ description: '옵션 목록', type: [ProductOptionUpdateDto], required: false })
    @IsArray()
    @Type(() => ProductOptionUpdateDto)
    options: ProductOptionUpdateDto[];
}