import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductMedia } from "../entity/product-media.entity";

@Injectable()
export class ProductMediaRepository extends Repository<ProductMedia> {
    constructor(private readonly dataSource: DataSource,) {
        super(ProductMedia, dataSource.createEntityManager());
    }
}