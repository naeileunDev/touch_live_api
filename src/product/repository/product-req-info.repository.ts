import { DataSource, Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductReqInfoCreateDto } from "../dto/product-req-info-create.dto";
import { ProductReqInfo } from "../entity/product-req-info.entity";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class ProductReqInfoRepository extends Repository<ProductReqInfo> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductReqInfo, dataSource.createEntityManager());
    }

    async createReqInfo(dto: ProductReqInfoCreateDto): Promise<ProductReqInfo> {
        const productReqInfo = this.create(
            {
                title: dto.title,
                itemList: dto.itemList as unknown as string[],
            }
        );
        return await this.save(productReqInfo);
    }

    async findAll(): Promise<ProductReqInfo[]> {
        return await this.find();
    }
}