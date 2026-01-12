import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { ShortFormModule } from 'src/short-form/short-form.module';
import { UserModule } from 'src/user/user.module';
import { LikeController } from './like.controller';
import { ProductLikeService } from './service/product-like.service';
import { ShortFormLikeService } from './service/short-form-like.service';
import { ProductLikeRepository } from './repository/product-like.repository';
import { ShortFormLikeRepository } from './repository/short-form-like.repository';
import { ReviewLikeService } from './service/review-like.service';
import { ReviewLikeRepository } from './repository/review-like.repository';
import { ReviewModule } from 'src/review/review.module';

@Module({
    imports: [UserModule, ProductModule, ShortFormModule, ReviewModule],
    controllers: [LikeController],
    providers: [
        ProductLikeService, 
        ShortFormLikeService, 
        ReviewLikeService, 
        ProductLikeRepository, 
        ShortFormLikeRepository, 
        ReviewLikeRepository,
    ],
})
export class LikeModule {}
