import { UserDto } from "src/user/dto";
import { OrderCreateDto } from "../dto/order-create.dto";
import { OrderDto } from "../dto/order.dto";
import { OrderRepository } from "../repository/order.repository";
import { UserService } from "src/user/service/user.service";

export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly userService: UserService,
    ) {}

    async create(dto: OrderCreateDto, userDto: UserDto): Promise<OrderDto> {
        const user = await this.userService.findEntityByPublicId(userDto.id, false);
        const order = await this.orderRepository.createOrder(dto, user);
        return new OrderDto(order, userDto);
    }
}