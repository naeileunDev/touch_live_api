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
import { CommentModule } from 'src/comment/comment.module';
import { CommentLikeService } from './service/comment-like.service';
import { CommentLikeRepository } from './repository/comment-like.repository';

@Module({
    imports: [UserModule, ProductModule, ShortFormModule, ReviewModule, CommentModule],
    controllers: [LikeController],
    providers: [
        ProductLikeService, 
        ShortFormLikeService, 
        ReviewLikeService, 
        CommentLikeService,
        ProductLikeRepository, 
        ShortFormLikeRepository, 
        ReviewLikeRepository,
        CommentLikeRepository,
    ],
})
export class LikeModule {}
