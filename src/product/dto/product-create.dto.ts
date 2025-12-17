import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProductCreateDto {
    @ApiProperty({ description: '상품명' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '가격' })
    @IsNotEmpty()
    @IsString()
    price: string;
}