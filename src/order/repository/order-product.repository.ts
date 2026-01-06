import { DataSource, Repository } from "typeorm";
import { OrderProduct } from "../entity/order-product.entity";
import { Injectable } from "@nestjs/common";
import { Order } from "../entity/order.entity";
import { OrderProductCreateDto } from "../dto/order-product-create.dto";

@Injectable()
export class OrderProductRepository extends Repository<OrderProduct> {
    constructor(private dataSource: DataSource) {
        super(OrderProduct, dataSource.createEntityManager());
    }

    async createOrderProduct(dto: OrderProductCreateDto, order: Order): Promise<OrderProduct> {
        const entity = this.create({
            ...dto,
            order,
        });
        return await this.save(entity);
    }

    async findById(id: number): Promise<OrderProduct> {
        return await this.findOne({ where: { id } });
    }

    async deleteById(id: number): Promise<boolean> {
        const result = await this.softDelete({ id });
        return result.affected > 0;
    }
}