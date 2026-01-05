import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortForm } from './entities/short-form.entity';
import { ShortFormProductTag } from './entities/short-form-product-tag.entity';
import { ShortFormTag } from './entities/short-form-tag.entity';
import { CreateShortFormDto, UpdateShortFormDto, ShortFormListQueryDto } from './dto/short-form.dto';

@Injectable()
export class ShortFormService {
    constructor(
        @InjectRepository(ShortForm)
        private readonly shortFormRepository: Repository<ShortForm>,
        @InjectRepository(ShortFormProductTag)
        private readonly productTagRepository: Repository<ShortFormProductTag>,
        @InjectRepository(ShortFormTag)
        private readonly tagRepository: Repository<ShortFormTag>,
    ) {}

    async create(storeId: number, dto: CreateShortFormDto): Promise<ShortForm> {
        // 유효성 검사
        if (dto.tagIds.length < 1 || dto.tagIds.length > 3) {
            throw new BadRequestException('해시태그는 1~3개 선택해야 합니다.');
        }

        if (dto.productIds.length < 1) {
            throw new BadRequestException('상품 태그는 1개 이상 선택해야 합니다.');
        }

        // 숏폼 생성
        const shortForm = this.shortFormRepository.create({
            storeId,
            thumbnailFileId: dto.thumbnailFileId,
            videoFileId: dto.videoFileId,
            whiteVideoFileId: dto.whiteVideoFileId,
            title: dto.title,
            duration: dto.duration,
        });

        const savedShortForm = await this.shortFormRepository.save(shortForm);

        // 해시태그 저장
        const tags = dto.tagIds.map((tagId, index) => 
            this.tagRepository.create({
                shortFormId: savedShortForm.id,
                tagId,
                displayOrder: index,
            })
        );
        await this.tagRepository.save(tags);

        // 상품 태그 저장
        const productTags = dto.productIds.map((productId, index) => 
            this.productTagRepository.create({
                shortFormId: savedShortForm.id,
                productId,
                displayOrder: index,
            })
        );
        await this.productTagRepository.save(productTags);

        return this.findOne(savedShortForm.id);
    }

    async findAll(query: ShortFormListQueryDto) {
        const { storeId, tagId, page = 1, limit = 20 } = query;

        const qb = this.shortFormRepository
            .createQueryBuilder('sf')
            .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('sf.store', 'store')
            .where('sf.deletedAt IS NULL')
            .andWhere('sf.isActive = true');

        if (storeId) {
            qb.andWhere('sf.storeId = :storeId', { storeId });
        }

        if (tagId) {
            qb.innerJoin('short_form_tag', 'sft', 'sft.shortFormId = sf.id AND sft.tagId = :tagId', { tagId });
        }

        const [items, total] = await qb
            .orderBy('sf.createdAt', 'DESC')
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

    async findOne(id: number): Promise<ShortForm> {
        const shortForm = await this.shortFormRepository.findOne({
            where: { id, deletedAt: null },
            relations: ['thumbnailFile', 'videoFile', 'whiteVideoFile', 'store', 'productTags', 'productTags.product'],
        });

        if (!shortForm) {
            throw new NotFoundException('숏폼을 찾을 수 없습니다.');
        }

        return shortForm;
    }

    async update(id: number, dto: UpdateShortFormDto): Promise<ShortForm> {
        const shortForm = await this.findOne(id);

        // 태그 업데이트
        if (dto.tagIds) {
            if (dto.tagIds.length < 1 || dto.tagIds.length > 3) {
                throw new BadRequestException('해시태그는 1~3개 선택해야 합니다.');
            }
            await this.tagRepository.delete({ shortFormId: id });
            const tags = dto.tagIds.map((tagId, index) => 
                this.tagRepository.create({
                    shortFormId: id,
                    tagId,
                    displayOrder: index,
                })
            );
            await this.tagRepository.save(tags);
        }

        // 상품 태그 업데이트
        if (dto.productIds) {
            await this.productTagRepository.delete({ shortFormId: id });
            const productTags = dto.productIds.map((productId, index) => 
                this.productTagRepository.create({
                    shortFormId: id,
                    productId,
                    displayOrder: index,
                })
            );
            await this.productTagRepository.save(productTags);
        }

        Object.assign(shortForm, {
            thumbnailFileId: dto.thumbnailFileId ?? shortForm.thumbnailFileId,
            videoFileId: dto.videoFileId ?? shortForm.videoFileId,
            whiteVideoFileId: dto.whiteVideoFileId ?? shortForm.whiteVideoFileId,
            title: dto.title ?? shortForm.title,
            isActive: dto.isActive ?? shortForm.isActive,
        });

        return this.shortFormRepository.save(shortForm);
    }

    async remove(id: number): Promise<void> {
        const shortForm = await this.findOne(id);
        shortForm.deletedAt = new Date();
        await this.shortFormRepository.save(shortForm);
    }

    async incrementViewCount(id: number): Promise<void> {
        await this.shortFormRepository.increment({ id }, 'viewCount', 1);
    }

    async updateLikeCount(id: number, delta: number): Promise<void> {
        await this.shortFormRepository.increment({ id }, 'likeCount', delta);
    }

    async updateCommentCount(id: number, delta: number): Promise<void> {
        await this.shortFormRepository.increment({ id }, 'commentCount', delta);
    }

    async getRecommended(limit = 20) {
        return this.shortFormRepository
            .createQueryBuilder('sf')
            .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('sf.store', 'store')
            .where('sf.deletedAt IS NULL')
            .andWhere('sf.isActive = true')
            .orderBy('sf.viewCount + sf.likeCount * 2', 'DESC')
            .take(limit)
            .getMany();
    }

    async getByStore(storeId: number, page = 1, limit = 20) {
        return this.findAll({ storeId, page, limit });
    }
}
