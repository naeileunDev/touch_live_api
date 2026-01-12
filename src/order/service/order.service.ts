import { UserDto } from "src/user/dto";
import { OrderCreateDto } from "../dto/order-create.dto";
import { OrderDto } from "../dto/order.dto";
import { OrderRepository } from "../repository/order.repository";
import { UserService } from "src/user/service/user.service";
import { Order } from "../entity/order.entity";
import { ProductService } from "src/product/product.service";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";
import { UserOrdersDto } from "../dto/user-orders.dto";
import { UserRole } from "src/user/enum/user-role.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly userService: UserService,
        private readonly productService: ProductService,
    ) {}

    async create(dto: OrderCreateDto, userDto: UserDto): Promise<OrderDto> {
        const user = await this.userService.findEntityByPublicId(userDto.id, false);
        const order = await this.orderRepository.createOrder(dto, user);
        const orderNo = await this.createOrderNo(order.orderProducts[0].productId, order);
        order.orderNo = orderNo;
        const savedOrder = await this.save(order);
        return new OrderDto(savedOrder, userDto);
    }

    async createOrderNo(productId: number, order: Order): Promise<string> {
        const product = await this.productService.findEntityById(productId);
        return `t-${product.storeId}-${order.id}-${order.createdAt.getTime().toString()}`;
    }

    async save(order: Order): Promise<Order> {
        return await this.orderRepository.save(order);
    }

    async findById(id: number): Promise<OrderDto> {
        const order = await this.orderRepository.findById(id);
        return new OrderDto(order, new UserDto(order.user));
    }

    async findEntityById(id: number): Promise<Order> {
        return await this.orderRepository.findById(id);
    }

    async findByUserId(publicId: string, query: PaginationDto, userDto: UserDto): Promise<UserOrdersDto> {
        if (userDto.id !== publicId && userDto.role === UserRole.User) {
            throw new ServiceException(MESSAGE_CODE.NOT_ALLOWED_OTHER);
        }
        const user = await this.userService.findEntityByPublicId(publicId);
        const { orders, total } = await this.orderRepository.findByUserId(user.id, query);
        return { orders: orders.map(order => new OrderDto(order, new UserDto(order.user))), total };
    }
}