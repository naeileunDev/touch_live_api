import { DataSource, Repository } from "typeorm";
import { Order } from "../entity/order.entity";
import { Injectable } from "@nestjs/common";
import { OrderCreateDto } from "../dto/order-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { User } from "src/user/entity/user.entity";

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
        const order = await this.findOne({ where: { id }, relations: ['user'] });
        if (!order) {
            throw new ServiceException(MESSAGE_CODE.ORDER_NOT_FOUND);
        }
        return order;
    }

    async deleteById(id: number): Promise<boolean> {
        const result = await this.softDelete({ id });
        return result.affected > 0;
    }
}