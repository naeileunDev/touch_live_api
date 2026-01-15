import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./repository/product.respository";
import { ProductMediaRepository } from "./repository/product-media.respository";
import { ProductOptionRepository } from "./repository/product-option.respository";
import { ProductOptionDetailRepository } from "./repository/product-option-detail.respository";
import { ProductCreateDto } from "./dto/product-create.dto";
import { ProductUpdateDto } from "./dto/product-update.dto";
import { ProductDto } from "./dto/product.dto";
import { ProductOptionDetailDto } from "./dto/product-option-detail.dto";
import { ProductOptionDto } from "./dto/product-option.dto";
import { ProductReadDto } from "./dto/product-read.dto";
import { Pagination, PaginationResponse } from "src/common/pagination/pagination.interface";
import { ProductOptionDetailStockRepository } from "./repository/product-option-detail-stock.repository";
import { Transactional } from "typeorm-transactional";
import { Product } from "./entity/product.entity";
import { User } from "src/user/entity/user.entity";
import { StoreService } from "src/store/store.service";
import { ProductFlexibleRepository } from "./repository/product-flexible.repository";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly productMediaRepository: ProductMediaRepository,
        private readonly productOptionRepository: ProductOptionRepository,
        private readonly productOptionDetailRepository: ProductOptionDetailRepository,
        private readonly productOptionDetailStockRepository: ProductOptionDetailStockRepository,
        private readonly productFlexibleRepository: ProductFlexibleRepository,
        // private readonly storeService: StoreService,
    ) { }

    /**
     * 상품 생성
     * @param store 스토어
     * @param productCreateDto 상품 생성 DTO
     * @returns 상품
     */
    @Transactional()
    async create(productCreateDto: ProductCreateDto, user: User) {
        // const store = await this.storeService.findEntityById(user.store.id);
        const { options, productFlexible } = productCreateDto;
        const now = new Date();
        // 판매자 수수료는 정산 시 따로? 일단 즉시 업로드냐 아니냐에 따라 즉시 업로드인 경우 판매자 수수료 청구
        const registerFee = productCreateDto?.registerFee ?? 0;

        // 상품 생성
        const product = await this.productRepository.createProduct({
            ...productCreateDto,
        });
        const productDto = new ProductDto(product);

        // 상품 수량 생성
        // await this.productStockRepository.createProductStock({
        //     stock: productCreateDto.stock,
        //     product,
        // });

        // 옵션 생성
        await Promise.all(options.map(async (option) => {
            const productOption = await this.productOptionRepository.createProductOption({
                ...option,
                product,
            });
            const productOptionDto = new ProductOptionDto(productOption);
            productDto.options.push(productOptionDto);

            // 옵션 상세 생성
            await Promise.all(option.optionDetails.map(async (optionDetail) => {
                const productOptionDetail = await this.productOptionDetailRepository.createProductOptionDetail({
                    ...optionDetail,
                    productOption,
                });
                const productOptionDetailDto = new ProductOptionDetailDto(productOptionDetail);
                productOptionDto.optionDetails.push(productOptionDetailDto);

                // 옵션 상세 수량 생성
                await this.productOptionDetailStockRepository.createProductOptionDetailStock({
                    stock: optionDetail.stock,
                    productOptionDetail,
                });
            }));
        }));

        return productDto;
    }

    /**
     * 상품 목록 조회
     * @returns 상품 목록
     */
    async findAll(productReadDto: ProductReadDto): Promise<PaginationResponse> {
        const { page, limit } = productReadDto;
        const [data, total] = await this.productRepository.findAll(productReadDto);
        const products = data.map(product => new ProductDto(product));
        return Pagination.create(products, total, page, limit);
    }

    /**
     * 상품 상세 조회
     * @param id 상품 ID
     * @returns 상품
     */
    async findById(id: number): Promise<ProductDto> {
        const product = await this.productRepository.findById(id);
        return new ProductDto(product);
    }

    /**
     * 상품 엔티티 조회
     * @param id 상품 ID
     * @returns 상품 엔티티
     */
    async findEntityById(id: number): Promise<Product> {
        return await this.productRepository.findById(id);
    }

    /**
    * 상품 수정
    * @param id 상품 ID
    * @param productUpdateDto 상품 수정 DTO
    * @returns 상품
    */
    async updateById(id: number, productUpdateDto: ProductUpdateDto) {
    }

    /**
     * 상품 삭제
     * @param id 상품 ID
     * @returns 상품
     */
    async deleteById(id: number): Promise<boolean> {
        const product = await this.productRepository.findById(id);
        return this.productRepository.deleteById(product.id);
    }
}