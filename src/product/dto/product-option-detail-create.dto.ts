import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
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

    @ApiProperty({ description: '조합 옵션 여부', type: Boolean, example: true })
    @IsBoolean()
    isMixed: boolean;
}