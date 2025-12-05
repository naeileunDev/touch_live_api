import { ApiProperty } from "@nestjs/swagger";

export class ProductDto {
    @ApiProperty({ description: '상품명' })
    name: string;

    @ApiProperty({ description: '가격' })
    price: number;
}