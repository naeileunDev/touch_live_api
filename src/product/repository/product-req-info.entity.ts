import { DataSource, Repository } from "typeorm";
import { ProductReqInfo } from "../entity/product-req-info.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductReqInfoRepository extends Repository<ProductReqInfo> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductReqInfo, dataSource.createEntityManager());
    }
}