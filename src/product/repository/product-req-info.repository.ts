import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductReqInfoCreateDto } from "../dto/product-req-info-create.dto";
import { ProductReqInfo } from "../entity/product-req-info.entity";

@Injectable()
export class ProductReqInfoRepository extends Repository<ProductReqInfo> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductReqInfo, dataSource.createEntityManager());
    }

    async createReqInfo(dto: ProductReqInfoCreateDto): Promise<ProductReqInfo> {
        console.log('createReqInfo', dto);
        const productReqInfo = this.create(
            {
                title: dto.title,
                itemList: dto.itemList as unknown as string[],
            }
        );
        console.log('productReqInfo', productReqInfo);
        return await this.save(productReqInfo);
    }

    async findAll(): Promise<ProductReqInfo[]> {
        return await this.find();
    }
}