import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { ProductOption } from "../entity/product-option.entity";
import { ProductOptionCreateDto } from "../dto/product-option-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class ProductOptionRepository extends Repository<ProductOption> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductOption, dataSource.createEntityManager());
    }

    async createProductOption(productOptionCreateDto: ProductOptionCreateDto): Promise<ProductOption> {
        const productOption = this.create(productOptionCreateDto);
        return this.save(productOption);
    }

    async findById(id: number): Promise<ProductOption> {
        const productOption = await this.findOne({ 
            where: { 
                id
            },
            relations: ['optionDetails'],
        });
        if (!productOption) {
            throw new ServiceException(MESSAGE_CODE.PRODUCT_OPTION_NOT_FOUND);
        }
        return productOption;
    }

    async deleteById(id: number): Promise<boolean> {
        const result = await this.softDelete({ 
            id,
        });
        return result.affected > 0;
    }
}