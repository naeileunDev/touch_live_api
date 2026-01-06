import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class OrderProductOptionCreateDto {
    @ApiProperty({ description: '주문 상품 ID', example: 1 })
    @IsInt()
    orderProductId: number;

    @ApiProperty({ description: '옵션 상세 ID', example: 1 })
    @IsInt()
    productOptionDetailId: number;

    @ApiProperty({ description: '옵션 수량', example: 1 })
    @IsInt()
    quantity: number;

    @ApiProperty({ description: '옵션 가격', example: 10000 })
    @IsInt()
    price: number;
}