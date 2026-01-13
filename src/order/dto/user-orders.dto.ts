import { ApiProperty } from "@nestjs/swagger";
import { OrderDto } from "./order.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Order } from "../entity/order.entity";
import { UserDto } from "src/user/dto";

export class UserOrdersDto {
    @ApiProperty({ description: '주문 목록', type: [OrderDto] })
    @ValidateNested({ each: true })
    @Type(() => OrderDto)
    orders: OrderDto[] = [];

    @ApiProperty({ description: '총 주문 수', example: 10 })
    total: number;

    constructor(orders: Order[], total: number) {
        this.orders = orders.map(order => new OrderDto(order, new UserDto(order.user)));
        this.total = total;
    }
}