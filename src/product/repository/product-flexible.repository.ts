import { DataSource, Repository } from "typeorm";
import { ProductFlexible } from "../entity/product-flexible.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductFlexibleRepository extends Repository<ProductFlexible> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductFlexible, dataSource.createEntityManager());
    }
}