import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { OrderService } from "./service/order.service";
import { UserDto } from "src/user/dto";
import { GetUser } from "src/common/decorator/get-user.decorator";
import { OrderCreateDto } from "./dto/order-create.dto";
import { OrderDto } from "./dto/order.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ALL_PERMISSION, USER_PERMISSION } from "src/common/permission/permission";
import { Role } from "src/common/decorator/role.decorator";
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";
import { UserOrdersDto } from "./dto/user-orders.dto";

@ApiTags('Order')
@Controller('order')
@ApiBearerAuth('access-token')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}

    @ApiOperation({ summary: '[유저 role] 주문 생성' })
    @Role(USER_PERMISSION)
    @ApiCreatedSuccessResponse(OrderDto, '주문 생성 성공')
    @Post()
    async create(@Body() dto: OrderCreateDto, @GetUser() userDto: UserDto): Promise<OrderDto> {
        return await this.orderService.create(dto, userDto);
    }

    @ApiOperation({ summary: '[모든 role] 주문 조회' })
    @Role(ALL_PERMISSION)
    @ApiOkSuccessResponse(OrderDto, '주문 조회 성공')
    @Get(':userId')
    async findByUserId(@Param('userId') userId: string, @Query() query: PaginationDto, @GetUser() userDto: UserDto): Promise<UserOrdersDto> {
        return await this.orderService.findByUserId(userId, query, userDto);
    }
}