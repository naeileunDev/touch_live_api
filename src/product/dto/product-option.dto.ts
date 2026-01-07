import { ApiProperty } from "@nestjs/swagger";
import { ProductOption } from "../entity/product-option.entity";
import { ProductOptionDetailDto } from "./product-option-detail.dto";

export class ProductOptionDto {
    @ApiProperty({ description: '옵션명' })
    name: string;

    @ApiProperty({ description: '옵션 상세 목록', type: [ProductOptionDetailDto] })
    optionDetails: ProductOptionDetailDto[];

    constructor(productOption: ProductOption) {
        
    }
}