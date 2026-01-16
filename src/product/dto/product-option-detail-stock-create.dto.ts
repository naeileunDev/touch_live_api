import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { ProductOptionDetailCreateDto } from "./product-option-detail-create.dto";

export class ProductOptionDetailStockCreateDto {
    @ApiProperty({ description: '수량', example: 10 })
    @IsNumber()
    stock: number;

    @ApiProperty({ description: '추가 요금', example: 1000 })
    @IsNumber()
    extraFee: number;

    @ApiProperty({ description: '상품 옵션 상세 ID', example: 1 })
    @IsNumber()
    detailId?: number;

    constructor(optionDetail: ProductOptionDetailCreateDto, detailId?: number) {
        Object.assign(this, optionDetail);
        this.detailId = detailId;
    }
}