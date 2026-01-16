import { ApiProperty } from "@nestjs/swagger";
import { ProductOptionDetail } from "../entity/product-option-detail.entity";
import { ProductOptionDetailStock } from "../entity/product-option-detail-stock.entity";

export class ProductOptionDetailDto {
    @ApiProperty({ description: '옵션 상세명', example: '옵션 상세명' })
    name: string;

    @ApiProperty({ description: '활성 여부', example: true })
    isActive: boolean;

    @ApiProperty({ description: '버전', example: new Date() })
    version: Date;

    @ApiProperty({ description: '옵션 상세 이미지 ID', example: 1 })
    fileId: number;

    @ApiProperty({ description: '상품 ID', example: 1 })
    productId: number;

    @ApiProperty({ description: '단일 옵션 여부', example: true })
    isMixed: boolean;

    @ApiProperty({ description: '옵션 상세 고유 ID(POD_랜덤UUID)', example: 'POD_1234567890' })
    publicId: string;
    
    @ApiProperty({ description: '수량', example: 10 })
    stock: number;
    
    @ApiProperty({ description: '추가 요금', example: 1000 })
    extraFee: number;

    constructor(productOptionDetail: ProductOptionDetail, detailStock: ProductOptionDetailStock) {
        Object.assign(this, productOptionDetail);
    }
}