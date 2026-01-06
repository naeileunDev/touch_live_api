import { DataSource, Repository } from "typeorm";
import { OrderProduct } from "../entity/order-product.entity";
import { Injectable } from "@nestjs/common";
import { Order } from "../entity/order.entity";
import { Product } from "src/product/entity/product.entity";

@Injectable()
export class OrderProductRepository extends Repository<OrderProduct> {
    constructor(private dataSource: DataSource) {
        super(OrderProduct, dataSource.createEntityManager());
    }

    async createOrderProduct(any): Promise<OrderProduct> {
        const entity = this.create(any);
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