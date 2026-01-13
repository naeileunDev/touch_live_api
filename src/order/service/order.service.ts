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
import { User } from "src/user/entity/user.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly userService: UserService,
        private readonly productService: ProductService,
    ) {}

    async create(dto: OrderCreateDto, user: User): Promise<OrderDto> {
        const userEntity = await this.userService.findEntityById(user.id, false);
        const order = await this.orderRepository.createOrder(dto, userEntity);
        const orderNo = await this.createOrderNo(order.orderProducts[0].productId, order);
        order.orderNo = orderNo;
        const savedOrder = await this.save(order);
        return new OrderDto(savedOrder, new UserDto(userEntity));
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
    // 유저 role 조회 시 자신의 주문만 조회 가능, 운영자 role 조회 시 모든 주문 조회 가능
    async findByUserId(userId: string, query: PaginationDto, user: User): Promise<UserOrdersDto> {
        if (user.publicId !== userId && user.role === UserRole.User) {
            throw new ServiceException(MESSAGE_CODE.NOT_ALLOWED_OTHER);
        }
        console.log("findByUserId", userId, user);
        const userEntity = await this.userService.findEntityByPublicId(userId);
        console.log("userEntity", userEntity);
        const { orders, total } = await this.orderRepository.findByUserId(userEntity.id, query);
        return new UserOrdersDto(orders, total);
    }
}