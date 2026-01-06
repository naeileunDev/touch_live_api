import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull, Or } from 'typeorm';
import { Banner } from './entity/banner.entity';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { BannerPosition } from 'src/common/enums';

@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>,
    ) {}

    async create(dto: CreateBannerDto): Promise<Banner> {
        const banner = this.bannerRepository.create(dto);
        return await this.bannerRepository.save(banner);
    }

    async findAll(position?: BannerPosition) {
        const now = new Date();

        const qb = this.bannerRepository
            .createQueryBuilder('b')
            .leftJoinAndSelect('b.file', 'file')
            .where('b.deletedAt IS NULL')
            .andWhere('b.isActive = true')
            .andWhere('(b.startAt IS NULL OR b.startAt <= :now)', { now })
            .andWhere('(b.endAt IS NULL OR b.endAt >= :now)', { now });

        if (position) {
            qb.andWhere('b.position = :position', { position });
        }

        return await qb.orderBy('b.displayOrder', 'ASC').getMany();
    }

    async findOne(id: number): Promise<Banner> {
        const banner = await this.bannerRepository.findOne({
            where: { id, deletedAt: null },
            relations: ['file'],
        });

        if (!banner) {
            throw new NotFoundException('배너를 찾을 수 없습니다.');
        }

        return banner;
    }

    async update(id: number, dto: UpdateBannerDto): Promise<Banner> {
        const banner = await this.findOne(id);
        Object.assign(banner, dto);
        return await this.bannerRepository.save(banner);
    }

    async remove(id: number): Promise<void> {
        const banner = await this.findOne(id);
        banner.deletedAt = new Date();
        await this.bannerRepository.save(banner);
    }
}
