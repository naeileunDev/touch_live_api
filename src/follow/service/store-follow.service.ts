import { StoreService } from "src/store/store.service";
import { StoreFollowRepository } from "../repository/store-follow.repository";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/service/user.service";
import { StoreFollowsDto } from "../dto/store-follows.dto";
import { FollowingStoreDto } from "../dto/following-store.dto";
import { StoreFollow } from "../entity/store-follow.entity";

@Injectable()
export class StoreFollowService {
    constructor(
        private readonly storeFollowRepository: StoreFollowRepository,
        private readonly storeService: StoreService,
        private readonly userService: UserService,
    ) {
        }

    async followAndUnfollow(followerId: string, storeId: number): Promise<boolean> {
        const follower = await this.userService.findEntityByPublicId(followerId);
        const store = await this.storeService.findEntityById(storeId);
        const existing = await this.storeFollowRepository.findByStoreId(follower.id, store.id);
        if (existing) {
            return await this.storeFollowRepository.deleteById(existing.id);
        }
        const deleted = await this.storeFollowRepository.existsByStoreIdWithDeleted(follower.id, store.id);
        if (deleted) {
            return await this.storeFollowRepository.restoreByStoreIdFast(follower.id, store.id);
        }
        await this.storeFollowRepository.createStoreFollow(follower.id, storeId);
        return true;
    }
     /**
     * 해당 유저가 팔로잉하는 스토어들의 팔로워 수를 반환
     * @param publicId 팔로우하는 유저의 publicId
     * @returns { stores: FollowingStoreDto[], followersCount: number } 형태의 객체
     * Ui 상 무한 스크롤로 7개씩 조회가능하기때문에 limit 기본값을 7로 설정
     * 예시: Store A가 Store B, Store C를 팔로우하는 경우
     * - Store B의 팔로워 수와 Store C의 팔로워 수를 반환
     */
    async findFollowingStoresFollowerCounts(publicId: string, lastId: number | null, limit: number = 7): Promise<StoreFollowsDto> {
        const user = await this.userService.findEntityByPublicId(publicId);
        const followingStores = await this.storeFollowRepository.findFollowingStoresFollowerCounts(user.id, lastId, limit);
        
        // store가 null인 경우 필터링 (soft delete된 store 제외)
        const validStores = followingStores[0].filter(store => store !== null);
        
        if (validStores.length === 0) {
            return new StoreFollowsDto([], followingStores[1]);
        }
        const stores: FollowingStoreDto[] = [];
        for (const store of validStores) {
            const followersCount = await this.storeFollowRepository.count({ where: { storeId: store.id } });
            stores.push(new FollowingStoreDto(store, followersCount));
        }
        
        return {
            stores: stores,
            total: followingStores[1]
        };
    }

    async findCountFollowers(storeId: number): Promise<number> {
        return await this.storeFollowRepository.countFollowersByStoreId(storeId);
    }

    async unfollow(publicId: string, storeIds: number[]): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(publicId);
        return await this.storeFollowRepository.deleteByStoreIds(user.id, storeIds);
    }

    
}