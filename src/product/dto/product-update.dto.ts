import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

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

}