import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entity/product.entity";
import { ProductOptionDto } from "./product-option.dto";

export class ProductDto {
    @ApiProperty({ description: '상품명' })
    name: string;

    @ApiProperty({ description: '가격' })
    price: number;

    @ApiProperty({ description: '옵션 목록', type: [ProductOptionDto] })
    options: ProductOptionDto[];

    constructor(product: Product) {

    }
}