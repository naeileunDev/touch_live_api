/**
 * =====================================================
 * ShortForm Recommendation Service - 숏폼 추천 알고리즘
 * =====================================================
 * 
 * 점수 기반 숏폼 추천 시스템
 * 
 * @weights 노출 비중 (총 100%)
 * - 사용자 히스토리 기반 (50%)
 *   - 검색 (15%): 최근 검색 키워드 기반 (기록 없으면 시청/팔로잉에 분배)
 *   - 시청 (30%): 10초 이상 시청 영상의 해시태그
 *   - 팔로잉 (5%): 팔로우 중인 스토어의 최신 영상
 * - 동일 연령대 인기 (30%): 최근 14일간 해당 연령대 조회수 높은 순
 * - 전체 인기 (15%): 최근 7일간 판매량(결제 완료) 기준
 * - 신규 콘텐츠 (5%): 업로드 3일 이내 신규 영상 랜덤
 * 
 * @period 반영 기간
 * - 사용자 히스토리: 최근 30일
 * - 동일 연령대 인기: 최근 14일
 * - 전체 인기: 최근 7일
 * - 신규 콘텐츠: 최근 3일
 * 
 * @author Claude
 * @date 2026-01-03
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { ShortForm } from './entities/short-form.entity';
import { ShortFormTag } from './entities/short-form-tag.entity';
import { VideoViewLog } from 'src/video/entities/video.entity';
import { SearchHistory } from 'src/search/entities/search-history.entity';
import { UserFollow } from 'src/follow/entities/user-follow.entity';
import { User } from 'src/user/entities/user.entity';
import { VideoTargetType, SearchType } from 'src/common/enums';

// =====================================================
// 추천 결과 인터페이스
// =====================================================

interface RecommendedShortForm {
    shortForm: ShortForm;
    score: number;
    source: string; // 추천 출처 (디버깅용)
}

interface RecommendationWeights {
    search: number;
    watch: number;
    following: number;
    agePopular: number;
    globalPopular: number;
    newContent: number;
}

@Injectable()
export class ShortFormRecommendationService {
    // =====================================================
    // 기본 가중치 설정
    // =====================================================

    private readonly DEFAULT_WEIGHTS: RecommendationWeights = {
        search: 0.15,      // 검색 기반 15%
        watch: 0.30,       // 시청 기반 30%
        following: 0.05,   // 팔로잉 기반 5%
        agePopular: 0.30,  // 동일 연령대 인기 30%
        globalPopular: 0.15, // 전체 인기 15%
        newContent: 0.05,  // 신규 콘텐츠 5%
    };

    // 기간 설정 (일 단위)
    private readonly PERIOD = {
        USER_HISTORY: 30,   // 사용자 히스토리 반영 기간
        AGE_POPULAR: 14,    // 연령대 인기 반영 기간
        GLOBAL_POPULAR: 7,  // 전체 인기 반영 기간
        NEW_CONTENT: 3,     // 신규 콘텐츠 기준
    };

    // 최소 시청 시간 (초)
    private readonly MIN_WATCH_DURATION = 10;

    constructor(
        @InjectRepository(ShortForm)
        private readonly shortFormRepository: Repository<ShortForm>,
        @InjectRepository(ShortFormTag)
        private readonly shortFormTagRepository: Repository<ShortFormTag>,
        @InjectRepository(VideoViewLog)
        private readonly viewLogRepository: Repository<VideoViewLog>,
        @InjectRepository(SearchHistory)
        private readonly searchHistoryRepository: Repository<SearchHistory>,
        @InjectRepository(UserFollow)
        private readonly followRepository: Repository<UserFollow>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    /**
     * 메인 추천 함수
     * 
     * @param userId - 추천 대상 사용자 ID
     * @param limit - 반환할 숏폼 개수
     * @returns 추천된 숏폼 목록
     */
    async getRecommendedShortForms(userId: number, limit: number = 20): Promise<ShortForm[]> {
        // 사용자 정보 조회 (연령대 확인용)
        const user = await this.userRepository.findOne({ where: { id: userId } });

        // 가중치 조정 (검색 기록 없으면 재분배)
        const weights = await this.adjustWeights(userId);

        // =====================================================
        // 각 카테고리별 숏폼 수집
        // =====================================================

        const [
            searchBased,
            watchBased,
            followingBased,
            agePopular,
            globalPopular,
            newContent,
        ] = await Promise.all([
            this.getSearchBasedShortForms(userId, Math.ceil(limit * weights.search * 2)),
            this.getWatchBasedShortForms(userId, Math.ceil(limit * weights.watch * 2)),
            this.getFollowingBasedShortForms(userId, Math.ceil(limit * weights.following * 2)),
            this.getAgePopularShortForms(user?.birth, Math.ceil(limit * weights.agePopular * 2)),
            this.getGlobalPopularShortForms(Math.ceil(limit * weights.globalPopular * 2)),
            this.getNewContentShortForms(Math.ceil(limit * weights.newContent * 2)),
        ]);

        // =====================================================
        // 점수 계산 및 병합
        // =====================================================

        const scoredMap = new Map<number, RecommendedShortForm>();

        // 각 카테고리별 점수 부여
        this.addScores(scoredMap, searchBased, weights.search, 'search');
        this.addScores(scoredMap, watchBased, weights.watch, 'watch');
        this.addScores(scoredMap, followingBased, weights.following, 'following');
        this.addScores(scoredMap, agePopular, weights.agePopular, 'agePopular');
        this.addScores(scoredMap, globalPopular, weights.globalPopular, 'globalPopular');
        this.addScores(scoredMap, newContent, weights.newContent, 'newContent');

        // =====================================================
        // 점수순 정렬 및 반환
        // =====================================================

        const sortedResults = Array.from(scoredMap.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        return sortedResults.map(r => r.shortForm);
    }

    /**
     * 가중치 조정
     * 검색 기록이 없으면 시청/팔로잉에 재분배
     */
    private async adjustWeights(userId: number): Promise<RecommendationWeights> {
        const weights = { ...this.DEFAULT_WEIGHTS };

        // 검색 기록 확인
        const searchCount = await this.searchHistoryRepository.count({
            where: {
                userId,
                searchType: SearchType.ShortForm,
                createdAt: MoreThan(this.getDateBefore(this.PERIOD.USER_HISTORY)),
            },
        });

        // 검색 기록 없으면 시청/팔로잉에 재분배
        if (searchCount === 0) {
            const redistributed = weights.search;
            weights.search = 0;
            weights.watch += redistributed * 0.85;  // 시청에 85% 재분배
            weights.following += redistributed * 0.15; // 팔로잉에 15% 재분배
        }

        return weights;
    }

    /**
     * 1-1. 검색 기반 추천 (15%)
     * 최근 30일 검색 키워드와 매칭되는 숏폼
     */
    private async getSearchBasedShortForms(userId: number, limit: number): Promise<ShortForm[]> {
        // 최근 검색어 조회
        const recentSearches = await this.searchHistoryRepository.find({
            where: {
                userId,
                searchType: SearchType.ShortForm,
                createdAt: MoreThan(this.getDateBefore(this.PERIOD.USER_HISTORY)),
            },
            order: { createdAt: 'DESC' },
            take: 20,
        });

        if (recentSearches.length === 0) {
            return [];
        }

        // 검색어 추출
        const keywords = [...new Set(recentSearches.map(s => s.keyword))];

        // 검색어로 숏폼 조회 (제목 또는 태그명 매칭)
        const qb = this.shortFormRepository
            .createQueryBuilder('sf')
            .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('sf.store', 'store')
            .leftJoin('short_form_tag', 'sft', 'sft.shortFormId = sf.id')
            .leftJoin('tag', 't', 't.id = sft.tagId')
            .where('sf.deletedAt IS NULL')
            .andWhere('sf.isActive = true');

        // 키워드 OR 조건
        const keywordConditions = keywords.map((_, i) =>
            `(sf.title ILIKE :kw${i} OR t.name ILIKE :kw${i})`
        ).join(' OR ');

        if (keywordConditions) {
            qb.andWhere(`(${keywordConditions})`);
            keywords.forEach((kw, i) => {
                qb.setParameter(`kw${i}`, `%${kw}%`);
            });
        }

        return qb
            .orderBy('sf.viewCount', 'DESC')
            .take(limit)
            .getMany();
    }

    /**
     * 1-2. 시청 기반 추천 (30%)
     * 10초 이상 시청한 영상의 해시태그 기반
     */
    private async getWatchBasedShortForms(userId: number, limit: number): Promise<ShortForm[]> {
        // 10초 이상 시청한 숏폼 조회
        const watchedLogs = await this.viewLogRepository.find({
            where: {
                userId,
                targetType: VideoTargetType.ShortForm,
                watchDuration: MoreThan(this.MIN_WATCH_DURATION),
                createdAt: MoreThan(this.getDateBefore(this.PERIOD.USER_HISTORY)),
            },
            order: { createdAt: 'DESC' },
            take: 50,
        });

        if (watchedLogs.length === 0) {
            return [];
        }

        const watchedIds = watchedLogs.map(log => log.targetId);

        // 시청한 숏폼의 태그 조회
        const watchedTags = await this.shortFormTagRepository.find({
            where: { shortFormId: In(watchedIds) },
        });

        if (watchedTags.length === 0) {
            return [];
        }

        const tagIds = [...new Set(watchedTags.map(t => t.tagId))];

        // 동일 태그를 가진 다른 숏폼 추천 (이미 본 것 제외)
        return this.shortFormRepository
            .createQueryBuilder('sf')
            .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('sf.store', 'store')
            .innerJoin('short_form_tag', 'sft', 'sft.shortFormId = sf.id')
            .where('sf.deletedAt IS NULL')
            .andWhere('sf.isActive = true')
            .andWhere('sft.tagId IN (:...tagIds)', { tagIds })
            .andWhere('sf.id NOT IN (:...watchedIds)', { watchedIds })
            .orderBy('sf.viewCount + sf.likeCount * 2', 'DESC')
            .take(limit)
            .getMany();
    }

    /**
     * 1-3. 팔로잉 기반 추천 (5%)
     * 팔로우 중인 스토어의 최신 영상
     */
    private async getFollowingBasedShortForms(userId: number, limit: number): Promise<ShortForm[]> {
        // 팔로우 중인 스토어(사용자) 조회
        const following = await this.followRepository.find({
            where: { followerId: userId },
        });

        if (following.length === 0) {
            return [];
        }

        const followingUserIds = following.map(f => f.followingId);

        // 팔로잉 유저들의 스토어 ID 조회 필요
        // User -> Store 관계가 있다고 가정
        return this.shortFormRepository
            .createQueryBuilder('sf')
            .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('sf.store', 'store')
            .innerJoin('store', 's', 's.id = sf.storeId')
            .where('sf.deletedAt IS NULL')
            .andWhere('sf.isActive = true')
            .andWhere('s.userId IN (:...followingUserIds)', { followingUserIds })
            .orderBy('sf.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }

    /**
     * 2. 동일 연령대 인기 추천 (30%)
     * 최근 14일간 해당 연령대에서 조회수 높은 순
     */
    private async getAgePopularShortForms(birth: string | null | undefined, limit: number): Promise<ShortForm[]> {
        const qb = this.shortFormRepository
            .createQueryBuilder('sf')
            .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('sf.store', 'store')
            .where('sf.deletedAt IS NULL')
            .andWhere('sf.isActive = true')
            .andWhere('sf.createdAt > :date', {
                date: this.getDateBefore(this.PERIOD.AGE_POPULAR)
            });

        // 연령대별 필터링 (birth가 있을 경우)
        // 시청 로그에서 해당 연령대 사용자들이 많이 본 숏폼 조회
        if (birth) {
            const age = this.calculateAgeFromString(birth);
            const ageGroup = this.getAgeGroup(age);

            // 해당 연령대 시청 로그 기반 인기 숏폼
            return this.shortFormRepository
                .createQueryBuilder('sf')
                .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
                .leftJoinAndSelect('sf.store', 'store')
                .innerJoin('video_view_log', 'vl', 'vl.targetId = sf.id AND vl.targetType = :type', {
                    type: VideoTargetType.ShortForm
                })
                .innerJoin('user', 'u', 'u.id = vl.userId')
                .where('sf.deletedAt IS NULL')
                .andWhere('sf.isActive = true')
                .andWhere('sf.createdAt > :date', {
                    date: this.getDateBefore(this.PERIOD.AGE_POPULAR)
                })
                .andWhere(this.getAgeGroupCondition(ageGroup))
                .groupBy('sf.id')
                .addGroupBy('thumbnail.id')
                .addGroupBy('store.id')
                .orderBy('COUNT(vl.id)', 'DESC')
                .take(limit)
                .getMany();
        }

        // birthDate 없으면 전체 조회수 기준
        return qb
            .orderBy('sf.viewCount', 'DESC')
            .take(limit)
            .getMany();
    }

    /**
     * 3. 전체 인기 추천 (15%)
     * 최근 7일간 판매량(결제 완료) 기준
     */
    private async getGlobalPopularShortForms(limit: number): Promise<ShortForm[]> {
        // 숏폼에 연결된 상품의 판매량 기준
        // Order 테이블이 있다고 가정
        return this.shortFormRepository
            .createQueryBuilder('sf')
            .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('sf.store', 'store')
            .leftJoin('short_form_product_tag', 'sfpt', 'sfpt.shortFormId = sf.id')
            .leftJoin('order_item', 'oi', 'oi.productId = sfpt.productId') // Order 테이블 조인
            .leftJoin('order', 'o', 'o.id = oi.orderId AND o.status = :status', {
                status: 'PAID' // 결제 완료 상태
            })
            .where('sf.deletedAt IS NULL')
            .andWhere('sf.isActive = true')
            .andWhere('o.createdAt > :date', {
                date: this.getDateBefore(this.PERIOD.GLOBAL_POPULAR)
            })
            .groupBy('sf.id')
            .addGroupBy('thumbnail.id')
            .addGroupBy('store.id')
            .orderBy('COUNT(oi.id)', 'DESC')
            .take(limit)
            .getMany();
    }

    /**
     * 4. 신규 콘텐츠 추천 (5%)
     * 업로드 3일 이내 신규 영상 랜덤
     */
    private async getNewContentShortForms(limit: number): Promise<ShortForm[]> {
        return this.shortFormRepository
            .createQueryBuilder('sf')
            .leftJoinAndSelect('sf.thumbnailFile', 'thumbnail')
            .leftJoinAndSelect('sf.store', 'store')
            .where('sf.deletedAt IS NULL')
            .andWhere('sf.isActive = true')
            .andWhere('sf.createdAt > :date', {
                date: this.getDateBefore(this.PERIOD.NEW_CONTENT)
            })
            .orderBy('RANDOM()') // PostgreSQL 랜덤
            .take(limit)
            .getMany();
    }

    // =====================================================
    // 유틸리티 함수
    // =====================================================

    /**
     * 점수 추가 (중복 시 누적)
     */
    private addScores(
        map: Map<number, RecommendedShortForm>,
        shortForms: ShortForm[],
        weight: number,
        source: string,
    ): void {
        shortForms.forEach((sf, index) => {
            // 순위별 점수 감소 (1위: 100%, 2위: 95%, ...)
            const rankScore = weight * (1 - index * 0.05);

            const existing = map.get(sf.id);
            if (existing) {
                existing.score += rankScore;
                existing.source += `, ${source}`;
            } else {
                map.set(sf.id, {
                    shortForm: sf,
                    score: rankScore,
                    source,
                });
            }
        });
    }

    /**
     * N일 전 날짜 반환
     */
    private getDateBefore(days: number): Date {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }

    /**
     * 나이 계산
     */
    private calculateAgeFromString(birth: string): number {
        const cleanBirth = birth.replace(/\D/g, '');
        const year = parseInt(cleanBirth.substring(0, 4));
        const month = parseInt(cleanBirth.substring(4, 6)) - 1;
        const day = parseInt(cleanBirth.substring(6, 8));

        const birthDate = new Date(year, month, day);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;

    }

    /**
     * 연령대 그룹 반환
     */
    private getAgeGroup(age: number): string {
        if (age < 20) return 'TEEN';
        if (age < 30) return '20S';
        if (age < 40) return '30S';
        if (age < 50) return '40S';
        return '50PLUS';
    }

    /**
     * 연령대 조건 SQL
     */
    private getAgeGroupCondition(ageGroup: string): string {
        const currentYear = new Date().getFullYear();
        switch (ageGroup) {
            case 'TEEN':
                return `EXTRACT(YEAR FROM AGE(u.birthDate)) < 20`;
            case '20S':
                return `EXTRACT(YEAR FROM AGE(u.birthDate)) BETWEEN 20 AND 29`;
            case '30S':
                return `EXTRACT(YEAR FROM AGE(u.birthDate)) BETWEEN 30 AND 39`;
            case '40S':
                return `EXTRACT(YEAR FROM AGE(u.birthDate)) BETWEEN 40 AND 49`;
            default:
                return `EXTRACT(YEAR FROM AGE(u.birthDate)) >= 50`;
        }
    }
}
