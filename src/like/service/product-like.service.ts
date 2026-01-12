import { Injectable } from '@nestjs/common';
import { ProductLikeRepository } from '../repository/product-like.repository';
import { UserService } from 'src/user/service/user.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ProductLikeService {
    constructor(
        private readonly productLikeRepository: ProductLikeRepository,
        private readonly userService: UserService,
        private readonly productService: ProductService,
    ) {}

    /**  
     * 해당 유저가 해당 제품을 좋아요 했는지 확인
     * @param userId 유저 ID
     * @param productId 제품 ID
     * @returns boolean
     */
    async isLiked(userId: string, productId: number): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(userId);
        const product = await this.productService.findEntityById(productId);
        return await this.productLikeRepository.existsByUserIdAndProductId(user.id, product.id);
    }

    // 이미 좋아요 되있으면 좋아요 취소, 없으면 좋아요 
    async likeAndUnlike(userId: string, productId: number): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(userId);
        const product = await this.productService.findEntityById(productId);
        const existing = await this.productLikeRepository.existsByUserIdAndProductId(user.id, product.id);
        if (existing) {
            return await this.productLikeRepository.deleteByUserIdAndProductId(user.id, product.id);
        }
        const deleted = await this.productLikeRepository.existsByUserIdAndProductIdWithDeleted(user.id, product.id);
        if (deleted) {
            return await this.productLikeRepository.restoreByUsersIdFast(user.id, product.id);
        }
        await this.productLikeRepository.createProductLike(user.id, product.id);
        return true;
    }

    // 해당 제품을 좋아하는 유저 수 return
    async findCountLikes(productId: number): Promise<number> {
        return await this.productLikeRepository.count({ where: { productId } });

    }
}