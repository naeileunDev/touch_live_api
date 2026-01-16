import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductOptionDetail } from "../entity/product-option-detail.entity";
import { ProductOptionDetailCreateDto } from "../dto/product-option-detail-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class ProductOptionDetailRepository extends Repository<ProductOptionDetail> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductOptionDetail, dataSource.createEntityManager());
    }

    async createProductOptionDetail(productOptionDetailCreateDto: ProductOptionDetailCreateDto): Promise<ProductOptionDetail> {
        const productOptionDetail = this.create(productOptionDetailCreateDto);
        productOptionDetail.version = productOptionDetail.createdAt;
        return this.save(productOptionDetail);
    }

    async createAll(createDtos: ProductOptionDetailCreateDto[]): Promise<ProductOptionDetail[]> {
        const productOptionDetails = this.create(
            createDtos.map(dto => Object.assign(new ProductOptionDetail(), dto))
        );
        return await this.save(productOptionDetails);
    }
    async findById(id: number): Promise<ProductOptionDetail> {
        const productOptionDetail = await this.findOne({ 
            where: { 
                id
            },
        });
        if (!productOptionDetail) {
            throw new ServiceException(MESSAGE_CODE.PRODUCT_OPTION_DETAIL_NOT_FOUND);
        }
        return productOptionDetail;
    }
}