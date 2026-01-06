import { DataSource, Repository } from "typeorm";
import { OrderProductOption } from "../entity/order-product-option.entity";

export class OrderProductOptionRepository extends Repository<OrderProductOption> {
    constructor(private dataSource: DataSource) {
        super(OrderProductOption, dataSource.createEntityManager());
    }
}