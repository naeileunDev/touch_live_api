import { StoreService } from "src/store/store.service";
import { StoreFollowRepository } from "../repository/store-follow.repository";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/service/user.service";
import { StoreFollowsDto } from "../dto/store-follows.dto";
import { FollowingStoreDto } from "../dto/following-store.dto";

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
     * 특정 스토어를 팔로잉하는 스토어들의 팔로워 수를 반환
     * @param storeId 팔로우하는 스토어의 ID
     * @returns [{ followingId: number, count: number }] 형태의 배열
     * Ui 상 무한 스크롤로 7개씩 조회가능하기때문에 limit 기본값을 7로 설정
     * 예시: Store A가 Store B, Store C를 팔로우하는 경우
     * - Store B의 팔로워 수와 Store C의 팔로워 수를 반환
     */
    async findFollowingStoresFollowerCounts(storeId: number, lastId: number | null, limit: number = 7): Promise<StoreFollowsDto> {
        const followingStores = await this.storeFollowRepository.findFollowingStoresFollowerCounts(storeId, lastId, limit);
        const followingStoreIds = followingStores[0].map(s => s.storeId);
        if (followingStoreIds.length === 0) {   
            return new StoreFollowsDto([], 0);
        }
        const stores: FollowingStoreDto[] = [];
        for (const store of followingStores[0]) {
            const followersCount = await this.storeFollowRepository.count({ where: { storeId: store.storeId } });
            stores.push(new FollowingStoreDto(store.store, followersCount));
        }
        return {
            stores: stores,
            followersCount: followingStores[1]
        };
    }

    async findCountFollowOrFollower(storeId: number, isFollowers: boolean): Promise<number> {
        if (!isFollowers) {
            return await this.storeFollowRepository.count({ where: { storeId } });
        }
        return await this.storeFollowRepository.count({ where: { followerId: storeId } });
    }

    async 

    
}