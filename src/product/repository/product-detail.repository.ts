import { DataSource, Repository } from "typeorm";
import { ProductDetail } from "../entity/product-detail.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductDetailRepository extends Repository<ProductDetail> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductDetail, dataSource.createEntityManager());
    }
}