import { ApiProperty } from "@nestjs/swagger";
import { Order } from "../entity/order.entity";
import { UserDto } from "src/user/dto";

export class OrderDto {
    @ApiProperty({ description: '주문 식별자', example: 'uuid' })
    id: number;

    @ApiProperty({ description: '주문 번호', example: '1234567890' })
    orderNo: string;

    @ApiProperty({ description: '사용자 숨김 여부', example: true })
    isUserHidden: boolean;

    @ApiProperty({ description: '사용자 식별자', example: 'uuid' })
    userId: string;

    @ApiProperty({ description: '생성일시', example: '2025-01-01 12:00:00' })
    createdAt: Date;

    @ApiProperty({ description: '수정일시', example: '2025-01-01 12:00:00' })
    updatedAt: Date;

    constructor(order: Order, user: UserDto) {
        this.id = order.id;
        this.orderNo = order.orderNo;
        this.isUserHidden = order.isUserHidden;
        this.userId = user.id;
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
    }
}