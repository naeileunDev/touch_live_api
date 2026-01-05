import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchHistory } from './entity/search-history.entity';
import { CreateSearchHistoryDto } from './dto/search.dto';
import { SearchType } from 'src/common/enums';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(SearchHistory)
        private readonly searchHistoryRepository: Repository<SearchHistory>,
    ) {}

    async saveHistory(userId: number, dto: CreateSearchHistoryDto): Promise<SearchHistory> {
        const history = this.searchHistoryRepository.create({
            userId,
            ...dto,
        });
        return this.searchHistoryRepository.save(history);
    }

    async getHistory(userId: number, searchType?: SearchType, limit = 10) {
        const qb = this.searchHistoryRepository
            .createQueryBuilder('sh')
            .where('sh.userId = :userId', { userId })
            .andWhere('sh.deletedAt IS NULL');

        if (searchType) {
            qb.andWhere('sh.searchType = :searchType', { searchType });
        }

        return qb
            .orderBy('sh.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }

    async deleteHistory(userId: number, id: number): Promise<void> {
        await this.searchHistoryRepository.update(
            { id, userId },
            { deletedAt: new Date() },
        );
    }

    async clearHistory(userId: number, searchType?: SearchType): Promise<void> {
        const qb = this.searchHistoryRepository
            .createQueryBuilder()
            .update()
            .set({ deletedAt: new Date() })
            .where('userId = :userId', { userId });

        if (searchType) {
            qb.andWhere('searchType = :searchType', { searchType });
        }

        await qb.execute();
    }

    async getPopularKeywords(searchType: SearchType, limit = 10) {
        return this.searchHistoryRepository
            .createQueryBuilder('sh')
            .select('sh.keyword', 'keyword')
            .addSelect('COUNT(*)', 'count')
            .where('sh.searchType = :searchType', { searchType })
            .andWhere('sh.deletedAt IS NULL')
            .andWhere('sh.createdAt > :date', { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) })
            .groupBy('sh.keyword')
            .orderBy('count', 'DESC')
            .limit(limit)
            .getRawMany();
    }
}
