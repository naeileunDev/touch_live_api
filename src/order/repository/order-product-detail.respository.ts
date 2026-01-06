import { DataSource, Repository } from "typeorm";
import { OrderProductOption } from "../entity/order-product-option.entity";
import { Injectable } from "@nestjs/common";
import { OrderProductOptionCreateDto } from "../dto/order-product-option-create.dto";

@Injectable()
export class OrderProductOptionRepository extends Repository<OrderProductOption> {
    constructor(private dataSource: DataSource) {
        super(OrderProductOption, dataSource.createEntityManager());
    }

    async createOrderProductOption(dto: OrderProductOptionCreateDto): Promise<OrderProductOption> {
        const orderProductOption = this.create(dto);
        return await this.save(orderProductOption);
    }
}