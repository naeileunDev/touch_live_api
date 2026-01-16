import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductOptionDetailStock } from "../entity/product-option-detail-stock.entity";
import { ProductOptionDetailStockCreateDto } from "../dto/product-option-detail-stock-create.dto";

@Injectable()
export class ProductOptionDetailStockRepository extends Repository<ProductOptionDetailStock> {
    constructor(private readonly dataSource: DataSource,) {
        super(ProductOptionDetailStock, dataSource.createEntityManager());
    }

    async createProductOptionDetailStock(productOptionDetailStockCreateDto: ProductOptionDetailStockCreateDto): Promise<ProductOptionDetailStock> {
        const productOptionDetailStock = this.create(productOptionDetailStockCreateDto);
        return this.save(productOptionDetailStock);
    }

    async createAll(createDtos: ProductOptionDetailStockCreateDto[]): Promise<ProductOptionDetailStock[]> {
        const productOptionDetailStocks = this.create(
            createDtos.map(dto => Object.assign(new ProductOptionDetailStock(), dto))
        );
        return await this.save(productOptionDetailStocks);
    }
}