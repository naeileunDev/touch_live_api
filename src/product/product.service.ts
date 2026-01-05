import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRequiredInfo } from './entity/product-required-info.entity';
import { CreateProductDto, UpdateProductDto, ProductListQueryDto } from './dto/product.dto';
import { ProductOptionType, ProductStatus } from 'src/common/enums';
import { Product } from './entity/product.entity';
import { ProductImage } from './entity/product-image.entity';
import { ProductOption } from './entity/product-option.entity';
import { ProductTag } from './entity/product-tag.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly imageRepository: Repository<ProductImage>,
        @InjectRepository(ProductOption)
        private readonly optionRepository: Repository<ProductOption>,
        @InjectRepository(ProductRequiredInfo)
        private readonly requiredInfoRepository: Repository<ProductRequiredInfo>,
        @InjectRepository(ProductTag)
        private readonly tagRepository: Repository<ProductTag>,
    ) {}

    async create(storeId: number, dto: CreateProductDto): Promise<Product> {
        // 유효성 검사
        if (dto.tagIds.length < 1 || dto.tagIds.length > 3) {
            throw new BadRequestException('해시태그는 1~3개 선택해야 합니다.');
        }

        if (dto.optionType === ProductOptionType.Single && dto.stock === undefined) {
            throw new BadRequestException('단일 옵션일 때 재고는 필수입니다.');
        }

        if (dto.optionType === ProductOptionType.Option && (!dto.options || dto.options.length === 0)) {
            throw new BadRequestException('옵션 타입일 때 옵션 목록은 필수입니다.');
        }

        // 최종 판매가 계산
        const salePrice = dto.discountRate 
            ? Math.floor(dto.price * (100 - dto.discountRate) / 100)
            : dto.price;

        // 제품 생성
        const product = this.productRepository.create({
            storeId,
            thumbnailFileId: dto.thumbnailFileId,
            name: dto.name,
            category: dto.category,
            price: dto.price,
            discountRate: dto.discountRate || 0,
            salePrice,
            optionType: dto.optionType,
            stock: dto.optionType === ProductOptionType.Single ? dto.stock : null,
            gender: dto.gender,
            age: dto.age,
            deliveryFee: dto.deliveryFee || 0,
            jejuDeliveryFee: dto.jejuDeliveryFee || 0,
            islandDeliveryFee: dto.islandDeliveryFee || 0,
            deliveryCompany: dto.deliveryCompany,
            deliveryPeriod: dto.deliveryPeriod,
            uploadType: dto.uploadType,
        });

        const savedProduct = await this.productRepository.save(product);

        // 상세 이미지 저장
        if (dto.detailImageFileIds?.length) {
            const images = dto.detailImageFileIds.map((fileId, index) => 
                this.imageRepository.create({
                    productId: savedProduct.id,
                    fileId,
                    imageType: 'DETAIL',
                    displayOrder: index,
                })
            );
            await this.imageRepository.save(images);
        }

        // 상세 정보 이미지 저장
        if (dto.infoImageFileIds?.length) {
            const infoImages = dto.infoImageFileIds.map((fileId, index) => 
                this.imageRepository.create({
                    productId: savedProduct.id,
                    fileId,
                    imageType: 'INFO',
                    displayOrder: index,
                })
            );
            await this.imageRepository.save(infoImages);
        }

        // 옵션 저장
        if (dto.optionType === ProductOptionType.Option && dto.options) {
            const options = dto.options.map((opt, index) => 
                this.optionRepository.create({
                    productId: savedProduct.id,
                    imageFileId: opt.imageFileId,
                    name: opt.name,
                    stock: opt.stock,
                    additionalPrice: opt.additionalPrice || 0,
                    displayOrder: index,
                })
            );
            await this.optionRepository.save(options);
        }

        // 필수 표기 정보 저장
        if (dto.requiredInfos?.length) {
            const infos = dto.requiredInfos.map((info, index) => 
                this.requiredInfoRepository.create({
                    productId: savedProduct.id,
                    itemType: info.itemType,
                    infoName: info.infoName,
                    infoValue: info.infoValue,
                    displayOrder: index,
                })
            );
            await this.requiredInfoRepository.save(infos);
        }

        // 태그 저장
        const tags = dto.tagIds.map((tagId, index) => 
            this.tagRepository.create({
                productId: savedProduct.id,
                tagId,
                displayOrder: index,
            })
        );
        await this.tagRepository.save(tags);

        return this.findOne(savedProduct.id);
    }

    async findAll(query: ProductListQueryDto) {
        const { category, gender, age, storeId, keyword, page = 1, limit = 20 } = query;

        const qb = this.productRepository
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('p.store', 'store')
            .where('p.deletedAt IS NULL')
            .andWhere('p.status = :status', { status: ProductStatus.OnSale });

        if (category) {
            qb.andWhere('p.category = :category', { category });
        }
        if (gender) {
            qb.andWhere('p.gender = :gender', { gender });
        }
        if (age) {
            qb.andWhere('p.age = :age', { age });
        }
        if (storeId) {
            qb.andWhere('p.storeId = :storeId', { storeId });
        }
        if (keyword) {
            qb.andWhere('p.name ILIKE :keyword', { keyword: `%${keyword}%` });
        }

        const [items, total] = await qb
            .orderBy('p.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id, deletedAt: null },
            relations: ['thumbnailFile', 'store', 'images', 'images.file', 'options', 'requiredInfos'],
        });

        if (!product) {
            throw new NotFoundException('상품을 찾을 수 없습니다.');
        }

        return product;
    }

    async update(id: number, dto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);

        // 가격 변경시 최종 판매가 재계산
        if (dto.price !== undefined || dto.discountRate !== undefined) {
            const price = dto.price ?? product.price;
            const discountRate = dto.discountRate ?? product.discountRate;
            dto['salePrice'] = Math.floor(price * (100 - discountRate) / 100);
        }

        Object.assign(product, dto);
        return this.productRepository.save(product);
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        product.deletedAt = new Date();
        await this.productRepository.save(product);
    }

    async incrementViewCount(id: number): Promise<void> {
        await this.productRepository.increment({ id }, 'viewCount', 1);
    }

    async getByStore(storeId: number, page = 1, limit = 20) {
        return this.findAll({ storeId, page, limit });
    }
}
