import { ShortFormLikeRepository } from "../repository/short-form-like.repository";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class ShortFormLikeService {
    constructor(
        private readonly shortFormLikeRepository: ShortFormLikeRepository,
        private readonly userService: UserService,
    ) {
        }

    async isLiked(userId: string, shortFormId: number): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(userId);
        return await this.shortFormLikeRepository.existsByUserIdAndShortFormId(user.id, shortFormId);
    }

    async likeAndUnlike(userId: string, shortFormId: number): Promise<boolean> {
        const user = await this.userService.findEntityByPublicId(userId);
        const existing = await this.shortFormLikeRepository.existsByUserIdAndShortFormId(user.id, shortFormId);
        if (existing) {
            return await this.shortFormLikeRepository.deleteByUserIdAndShortFormId(user.id, shortFormId);
        }
        const deleted = await this.shortFormLikeRepository.existsByUserIdAndShortFormIdWithDeleted(user.id, shortFormId);
        if (deleted) {
            return await this.shortFormLikeRepository.restoreByUsersIdFast(user.id, shortFormId);
        }
        await this.shortFormLikeRepository.createShortFormLike(user.id, shortFormId);
        return true;
    }

    async findCountLikes(shortFormId: number): Promise<number> {
        return await this.shortFormLikeRepository.count({ where: { shortFormId } });
    }

}