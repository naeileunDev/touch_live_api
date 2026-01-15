import { Injectable } from "@nestjs/common";
import { ProductReqInfoCreateDto } from "../dto/product-req-info-create.dto";
import { ProductReqInfo } from "../entity/product-req-info.entity";
import { ProductReqInfoRepository } from "../repository/product-req-info.repository";

@Injectable()
export class ProductReqInfoService {
    constructor(
        private readonly productReqInfoRepository: ProductReqInfoRepository
    ) {
    }

    async create(dto: ProductReqInfoCreateDto): Promise<ProductReqInfo> {
        return await this.productReqInfoRepository.createReqInfo(dto);
    }

    async findAll(): Promise<ProductReqInfo[]> {
        return await this.productReqInfoRepository.findAll();
    }
}