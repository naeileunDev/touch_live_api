import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./repository/product.respository";
import { ProductCreateDto } from "./dto/product-create.dto";
import { ProductUpdateDto } from "./dto/product-update.dto";
import { ProductDto } from "./dto/product.dto";
import { ProductReadDto } from "./dto/product-read.dto";
import { Pagination, PaginationResponse } from "src/common/pagination/pagination.interface";
import { Transactional } from "typeorm-transactional";
import { Product } from "./entity/product.entity";
import { User } from "src/user/entity/user.entity";
import { ProductFlexibleRepository } from "./repository/product-flexible.repository";
import { ProductMediaRepository } from "./repository/product-media.respository";
import { ProductOptionDetailCreateDto } from "./dto/product-option-detail-create.dto";
import { ProductOptionDetailRepository } from "./repository/product-option-detail.respository";
import { ProductOptionDetailStockCreateDto } from "./dto/product-option-detail-stock-create.dto";
import { ProductOptionDetailStockRepository } from "./repository/product-option-detail-stock.repository";
import { ProductFlexibleCreateDto } from "./dto/product-flexible-create.dto";
import { ProductOptionDetailDto } from "./dto/product-option-detail.dto";
import { ProductWithOptionsDto } from "./dto/product-with-options-dto";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly productFlexibleRepository: ProductFlexibleRepository,
        private readonly productMediaRepository: ProductMediaRepository,
        private readonly productOptionDetailRepository: ProductOptionDetailRepository,
        private readonly productOptionDetailStockRepository: ProductOptionDetailStockRepository,
    ) { }

    /**
     * 상품 생성
     * @param store 스토어
     * @param productCreateDto 상품 생성 DTO
     * @returns 상품
     */
    @Transactional()
    async create(dto: ProductCreateDto, user: User): Promise<ProductWithOptionsDto> {
        // 상품 생성 
        const product = await this.productRepository.createProduct(dto, user.store.id);
        const flexible = new ProductFlexibleCreateDto(dto);
        await this.productFlexibleRepository.createProductFlexible(flexible, product.id);
        const { options,files} = dto;
        const optionImages = files.optionImages;
        const optionDtos = [];
        for (const option of options) {
            for (const file of optionImages) {
                if (file.field === option.name) {
                    option.fileId = file.id;
                    const optionDetail = new ProductOptionDetailCreateDto(option, file.id, product.id);
                    const optionDetailEntity =await this.productOptionDetailRepository.createProductOptionDetail(optionDetail);
                    const optionDetailStock = new ProductOptionDetailStockCreateDto(optionDetail, optionDetailEntity.id);
                    const optionDetailStockEntity = await this.productOptionDetailStockRepository.createProductOptionDetailStock(optionDetailStock);
                    optionDtos.push(new ProductOptionDetailDto(optionDetailEntity, optionDetailStockEntity));
                }
            }
        }
        return new ProductWithOptionsDto(product, optionDtos);
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