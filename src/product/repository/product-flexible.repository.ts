import { DataSource, Repository } from "typeorm";
import { ProductFlexible } from "../entity/product-flexible.entity";
import { Injectable } from "@nestjs/common";
import { ProductFlexibleCreateDto } from "../dto/product-flexible-create.dto";

@Injectable()
export class ProductFlexibleRepository extends Repository<ProductFlexible> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductFlexible, dataSource.createEntityManager());
    }

    async createProductFlexible(productFlexible: ProductFlexibleCreateDto, productId: number): Promise<ProductFlexible> {
        const flexible = this.create({
            ...productFlexible,
            productId: productId,
            product: { id: productId },
        });
        flexible.version = flexible.createdAt;
        return await this.save(flexible);
    }
}