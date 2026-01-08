import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductStock } from "../entity/product-stock.entity";
import { ProductStockCreateDto } from "../dto/product-stock-create.dto";

@Injectable()
export class ProductStockRepository extends Repository<ProductStock> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductStock, dataSource.createEntityManager());
    }

    async createProductStock(productStockCreateDto: ProductStockCreateDto): Promise<ProductStock> {
        const productStock = this.create(productStockCreateDto);
        return this.save(productStock);
    }
}