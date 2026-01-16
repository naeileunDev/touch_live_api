import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./repository/product.respository";
import { ProductMediaRepository } from "./repository/product-media.respository";
import { ProductOptionDetailRepository } from "./repository/product-option-detail.respository";
import { ProductCreateDto } from "./dto/product-create.dto";
import { ProductUpdateDto } from "./dto/product-update.dto";
import { ProductDto } from "./dto/product.dto";
import { ProductReadDto } from "./dto/product-read.dto";
import { Pagination, PaginationResponse } from "src/common/pagination/pagination.interface";
import { ProductOptionDetailStockRepository } from "./repository/product-option-detail-stock.repository";
import { Transactional } from "typeorm-transactional";
import { Product } from "./entity/product.entity";
import { User } from "src/user/entity/user.entity";
import { ProductFlexibleRepository } from "./repository/product-flexible.repository";
import { ProductFlexible } from "./entity/product-flexible.entity";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly productFlexibleRepository: ProductFlexibleRepository,
    ) { }

    /**
     * 상품 생성
     * @param store 스토어
     * @param productCreateDto 상품 생성 DTO
     * @returns 상품
     */
    @Transactional()
    async create(dto: ProductCreateDto, user: User) {
        const {price, deliveryFee, deliveryCompany, deliveryPeriod, jejuDeliveryFee, islandDeliveryFee, charge} = dto;
        const now = new Date(); // 버전 관리를 위한 날짜
        // 판매자 수수료는 정산 시 따로? 일단 즉시 업로드냐 아니냐에 따라 즉시 업로드인 경우 판매자 수수료 청구
        const registerFee = dto?.registerFee ?? 0;

        // 상품 생성
        const product = new Product();
        product.name = dto.name;
        product.targetGender = dto.targetGender;
        product.targetAge = dto.targetAge;
        product.registerFee = registerFee;
        product.version = now;
        product.isMixed = dto.isMixed;
        product.isActive = true;
        product.isApproved = false;    

        // 상품 저장
        const savedProduct = await this.productRepository.save(product);
        const productFlexible = new ProductFlexible();
        productFlexible.product = savedProduct;
        productFlexible.price = price;
        productFlexible.deliveryFee = deliveryFee;
        productFlexible.deliveryCompany = deliveryCompany;
        productFlexible.deliveryPeriod = deliveryPeriod;
        productFlexible.jejuDeliveryFee = jejuDeliveryFee;
        productFlexible.islandDeliveryFee = islandDeliveryFee;
        productFlexible.charge = charge;
        productFlexible.version = now;
        productFlexible.isActive = true;
        await this.productFlexibleRepository.save(productFlexible);        // 옵션 생성


        return new ProductDto(savedProduct);
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