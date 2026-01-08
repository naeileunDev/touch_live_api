import { DataSource, Repository } from "typeorm";
import { Product } from "../entity/product.entity";
import { Injectable } from "@nestjs/common";
import { ProductCreateDto } from "../dto/product-create.dto";
import { ProductReadDto } from "../dto/product-read.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class ProductRepository extends Repository<Product> {
    constructor(private readonly dataSource: DataSource,) {
        super(Product, dataSource.createEntityManager());
    }

    async createProduct(productCreateDto: ProductCreateDto): Promise<Product> {
        const product = this.create(productCreateDto);
        return this.save(product);
    }

    async findAll(productReadDto: ProductReadDto): Promise<[Product[], number]> {
        const { page, limit } = productReadDto;
        const [data, total] = await this.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return [data, total];
    }

    async findById(id: number): Promise<Product> {
        const product = await this.findOne({ 
            where: { 
                id
            },
        });
        if (!product) {
            throw new ServiceException(MESSAGE_CODE.PRODUCT_NOT_FOUND);
        }
        return product;
    }


    async deleteById(id: number): Promise<boolean> {
        const result = await this.softDelete({ 
            id 
        });
        return result.affected > 0;
    }
}