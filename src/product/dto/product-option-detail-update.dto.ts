import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductOptionDetailUpdateDto {
    @ApiProperty({ description: '옵션 상세명', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: '수량', required: false })
    @IsOptional()
    @IsNumber()
    stock?: number;
}