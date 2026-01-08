import { ApiProperty } from "@nestjs/swagger";
import { ProductOptionDetail } from "../entity/product-option-detail.entity";

export class ProductOptionDetailDto {
    @ApiProperty({ description: '옵션 상세명' })
    name: string;

    @ApiProperty({ description: '수량' })
    stock: number;

    constructor(productOptionDetail: ProductOptionDetail) {
        this.name = productOptionDetail.name;
    }
}