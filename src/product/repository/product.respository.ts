import { DataSource, Repository } from "typeorm";
import { Product } from "../entity/product.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepository extends Repository<Product> {
    constructor(
        private readonly dataSource: DataSource,
    ) {
        super(Product, dataSource.createEntityManager());
    }
}