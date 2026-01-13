import { Controller, Get, Post, Param, Query, ParseIntPipe, Body, ParseArrayPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiExtraModels, ApiBody } from '@nestjs/swagger';
import { ProductLikeService } from './service/product-like.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ALL_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { Role } from 'src/common/decorator/role.decorator';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { ShortFormLikeService } from './service/short-form-like.service';
import { ReviewLikeService } from './service/review-like.service';
import { CommentLikeService } from './service/comment-like.service';
import { User } from 'src/user/entity/user.entity';

@ApiTags('Like')
@Controller('like')
@ApiBearerAuth('access-token')
export class LikeController {
    constructor(
        private readonly productLikeService: ProductLikeService,
        private readonly shortFormLikeService: ShortFormLikeService,
        private readonly reviewLikeService: ReviewLikeService,
        private readonly commentLikeService: CommentLikeService,
    ) {}

    @Get('product/check/:productId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '해당 제품 좋아요 여부 확인' })
    @ApiOkSuccessResponse(Boolean, '팔로우 여부 확인 성공')
    checkProductLike(
        @GetUser() user: User,
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<boolean> {
        return this.productLikeService.isLiked(user.publicId, productId);
    }

    @Post('product/:productId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '제품 좋아요/좋아요 취소 토글 (해당 제품 좋아요/좋아요 취소)' })
    @ApiOkSuccessResponse(Boolean, '제품 좋아요/좋아요 취소 토글 성공')
    toggleProductLike(@GetUser() user: User, @Param('productId', ParseIntPipe) productId: number): Promise<boolean> {
        return this.productLikeService.likeAndUnlike(user.publicId, productId);
    }

    @Get('product/count/:productId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 제품 좋아요 수' })
    @ApiOkSuccessResponse(Number, '해당 제품 좋아요 수 조회 성공')
    getCountProductLikes(
        @Param('productId', ParseIntPipe) productId: number, 
    ): Promise<number> {
        return this.productLikeService.findCountLikes(productId);
    }

    @Get('short-form/check/:shortFormId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '해당 숏폼 좋아요 여부 확인' })
    @ApiOkSuccessResponse(Boolean, '좋아요 여부 확인 성공')
    checkShortFormLike(
        @GetUser() user: User,
        @Param('shortFormId', ParseIntPipe) shortFormId: number,
    ): Promise<boolean> {
        return this.shortFormLikeService.isLiked(user.publicId, shortFormId);
    }

    @Post('short-form/:shortFormId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '숏폼 좋아요/좋아요 취소 토글 (해당 숏폼 좋아요/좋아요 취소)' })
    @ApiOkSuccessResponse(Boolean, '숏폼 좋아요/좋아요 취소 토글 성공')
    toggleShortFormLike(@GetUser() user: User, @Param('shortFormId', ParseIntPipe) shortFormId: number): Promise<boolean> {
        return this.shortFormLikeService.likeAndUnlike(user.publicId, shortFormId);
    }

    @Get('short-form/count/:shortFormId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 숏폼 좋아요 수' })
    @ApiOkSuccessResponse(Number, '해당 숏폼 좋아요 수 조회 성공')
    getCountShortFormLikes(
        @Param('shortFormId', ParseIntPipe) shortFormId: number, 
    ): Promise<number> {
        return this.shortFormLikeService.findCountLikes(shortFormId);
    }

    @Get('review/check/:reviewId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '해당 리뷰 좋아요 여부 확인' })
    @ApiOkSuccessResponse(Boolean, '좋아요 여부 확인 성공')
    checkReviewLike(
        @GetUser() user: User,
        @Param('reviewId', ParseIntPipe) reviewId: number,
    ): Promise<boolean> {
        return this.reviewLikeService.isLiked(user.publicId, reviewId);
    }   

    @Post('review/:reviewId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '리뷰 좋아요/좋아요 취소 토글 (해당 리뷰 좋아요/좋아요 취소)' })
    @ApiOkSuccessResponse(Boolean, '리뷰 좋아요/좋아요 취소 토글 성공')
    toggleReviewLike(@GetUser() user: User, @Param('reviewId', ParseIntPipe) reviewId: number): Promise<boolean> {
        return this.reviewLikeService.likeAndUnlike(user.publicId, reviewId);
    }

    @Get('review/count/:reviewId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 리뷰 좋아요 수' })
    @ApiOkSuccessResponse(Number, '해당 리뷰 좋아요 수 조회 성공')
    getCountReviewLikes(
        @Param('reviewId', ParseIntPipe) reviewId: number, 
    ): Promise<number> {
        return this.reviewLikeService.findCountLikes(reviewId);
    }

    @Get('comment/check/:commentId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '해당 댓글 좋아요 여부 확인' })
    @ApiOkSuccessResponse(Boolean, '좋아요 여부 확인 성공')
    checkCommentLike(
        @GetUser() user: User,
        @Param('commentId', ParseIntPipe) commentId: number,
    ): Promise<boolean> {
        return this.commentLikeService.isLiked(user.publicId, commentId);
    }

    @Post('comment/:commentId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '댓글 좋아요/좋아요 취소 토글 (해당 댓글 좋아요/좋아요 취소)' })
    @ApiOkSuccessResponse(Boolean, '댓글 좋아요/좋아요 취소 토글 성공')
    toggleCommentLike(@GetUser() user: User, @Param('commentId', ParseIntPipe) commentId: number): Promise<boolean> {
        return this.commentLikeService.likeAndUnlike(user.publicId, commentId);
    }

    @Get('comment/count/:commentId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 댓글 좋아요 수' })
    @ApiOkSuccessResponse(Number, '해당 댓글 좋아요 수 조회 성공')
    getCountCommentLikes(
        @Param('commentId', ParseIntPipe) commentId: number, 
    ): Promise<number> {
        return this.commentLikeService.findCountLikes(commentId);
    }
}
