import { ApiProperty } from "@nestjs/swagger";
import { ProductOptionDetailUpdateDto } from "./product-option-detail-update.dto";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ProductOptionUpdateDto {
    @ApiProperty({ description: '옵션 ID' })
    @IsNotEmpty()
    @IsNumber()
    id: number;
    
    @ApiProperty({ description: '옵션명', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: '옵션 상세 목록', type: [ProductOptionDetailUpdateDto] })
    @IsOptional()
    @IsArray()
    @Type(() => ProductOptionDetailUpdateDto)
    optionDetails: ProductOptionDetailUpdateDto[];
}