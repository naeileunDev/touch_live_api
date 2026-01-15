import { Injectable } from "@nestjs/common";
import { ProductReqInfoCreateDto } from "../dto/product-req-info-create.dto";
import { ProductReqInfo } from "../entity/product-req-info.entity";
import { ProductReqInfoRepository } from "../repository/product-req-info.repository";
import { ProductReqInfoDto } from "../dto/product-req-info.dto";

@Injectable()
export class ProductReqInfoService {
    constructor(
        private readonly productReqInfoRepository: ProductReqInfoRepository
    ) {
    }

    async create(dto: ProductReqInfoCreateDto): Promise<ProductReqInfo> {
        return await this.productReqInfoRepository.createReqInfo(dto);
    }

    async findAll(): Promise<ProductReqInfoDto[]> {
        const infos = await this.productReqInfoRepository.findAll();
        return infos.map(info => new ProductReqInfoDto(info));
    }
}