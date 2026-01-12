import { DataSource, Repository } from "typeorm";
import { Order } from "../entity/order.entity";
import { Injectable } from "@nestjs/common";
import { OrderCreateDto } from "../dto/order-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { User } from "src/user/entity/user.entity";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(private dataSource: DataSource) {
        super(Order, dataSource.createEntityManager());
    }

    async createOrder(dto: OrderCreateDto, user: User): Promise<Order> {
        const order = this.create(dto);
        return await this.save(order);
    }

    async findById(id: number): Promise<Order> {
        const order = await this.findOne({ where: { id }, relations: ['user', 'orderProducts'] });
        if (!order) {
            throw new ServiceException(MESSAGE_CODE.ORDER_NOT_FOUND);
        }
        return order;
    }

    async deleteById(id: number): Promise<boolean> {
        const result = await this.softDelete({ id });
        return result.affected > 0;
    }

    async findByUserId(userId: number, query: PaginationDto): Promise<{orders: Order[], total: number}> {
        const [orders, total] = await this.findAndCount({ where: { 
            user: { id: userId } 
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        relations: ['user', 'orderProducts'],
        order: {
            createdAt: 'DESC',
        },
    });
    return { orders, total };
    }
}