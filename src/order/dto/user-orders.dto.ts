import { ApiProperty } from "@nestjs/swagger";
import { OrderDto } from "./order.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UserOrdersDto {
    @ApiProperty({ description: '주문 목록', type: [OrderDto] })
    @ValidateNested({ each: true })
    @Type(() => OrderDto)
    orders: OrderDto[] = [];

    @ApiProperty({ description: '총 주문 수', example: 10 })
    total: number;
}