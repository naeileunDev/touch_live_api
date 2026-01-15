import { DataSource, Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductReqInfoCreateDto } from "../dto/product-req-info-create.dto";
import { ProductReqInfo } from "../entity/product-req-info.entity";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { ProductReqInfoUpdateDto } from "../dto/product-req-info-update.dto";

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

    async findById(id: number): Promise<ProductReqInfo> {
        const productReqInfo = await this.findOne({ where: { id } });
        if (!productReqInfo) {
            throw new ServiceException(MESSAGE_CODE.PRODUCT_REQ_INFO_NOT_FOUND);
        }
        return productReqInfo;
    }

    async updateById(id: number, dto: ProductReqInfoUpdateDto): Promise<ProductReqInfo> {
        const productReqInfo = await this.findById(id);
        Object.assign(productReqInfo, dto);
        return await this.save(productReqInfo);
    }
}