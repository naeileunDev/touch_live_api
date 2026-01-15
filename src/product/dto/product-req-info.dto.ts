import { ApiProperty } from "@nestjs/swagger";
import { ProductReqInfo } from "../entity/product-req-info.entity";

export class ProductReqInfoDto {
    @ApiProperty({ description: '상품 분류 이름' })
    title: string;

    @ApiProperty({ description: '상품 분류 속성 리스트' })
    itemList: string[];

    constructor(productReqInfo: ProductReqInfo) {
        this.title = productReqInfo.title;
        this.itemList = productReqInfo.itemList;
    }
}