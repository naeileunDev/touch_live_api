import { Controller, Get, Post, Param, Query, ParseIntPipe, Body, ParseArrayPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiExtraModels, ApiBody } from '@nestjs/swagger';
import { ProductLikeService } from './service/product-like.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ALL_PERMISSION, ANY_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { Role } from 'src/common/decorator/role.decorator';
import { UserDto } from 'src/user/dto';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { ShortFormLikeService } from './service/short-form-like.service';
import { ReviewLikeService } from './service/review-like.service';

@ApiTags('Like')
@Controller('like')
@ApiBearerAuth('access-token')
export class LikeController {
    constructor(
        private readonly productLikeService: ProductLikeService,
        private readonly shortFormLikeService: ShortFormLikeService,
        private readonly reviewLikeService: ReviewLikeService,
    ) {}

    @Get('product/check/:productId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '해당 제품 좋아요 여부 확인' })
    @ApiOkSuccessResponse(Boolean, '팔로우 여부 확인 성공')
    checkProductLike(
        @GetUser() userDto: UserDto,
        @Param('productId', ParseIntPipe) productId: number,
    ): Promise<boolean> {
        return this.productLikeService.isLiked(userDto.id, productId);
    }

    @Post('product/:productId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '제품 좋아요/좋아요 취소 토글 (해당 제품 좋아요/좋아요 취소)' })
    @ApiOkSuccessResponse(Boolean, '제품 좋아요/좋아요 취소 토글 성공')
    toggleProductLike(@GetUser() userDto: UserDto, @Param('productId', ParseIntPipe) productId: number): Promise<boolean> {
        return this.productLikeService.likeAndUnlike(userDto.id, productId);
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
        @GetUser() userDto: UserDto,
        @Param('shortFormId', ParseIntPipe) shortFormId: number,
    ): Promise<boolean> {
        return this.shortFormLikeService.isLiked(userDto.id, shortFormId);
    }

    @Post('short-form/:shortFormId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '숏폼 좋아요/좋아요 취소 토글 (해당 숏폼 좋아요/좋아요 취소)' })
    @ApiOkSuccessResponse(Boolean, '숏폼 좋아요/좋아요 취소 토글 성공')
    toggleShortFormLike(@GetUser() userDto: UserDto, @Param('shortFormId', ParseIntPipe) shortFormId: number): Promise<boolean> {
        return this.shortFormLikeService.likeAndUnlike(userDto.id, shortFormId);
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
        @GetUser() userDto: UserDto,
        @Param('reviewId', ParseIntPipe) reviewId: number,
    ): Promise<boolean> {
        return this.reviewLikeService.isLiked(userDto.id, reviewId);
    }   

    @Post('review/:reviewId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '리뷰 좋아요/좋아요 취소 토글 (해당 리뷰 좋아요/좋아요 취소)' })
    @ApiOkSuccessResponse(Boolean, '리뷰 좋아요/좋아요 취소 토글 성공')
    toggleReviewLike(@GetUser() userDto: UserDto, @Param('reviewId', ParseIntPipe) reviewId: number): Promise<boolean> {
        return this.reviewLikeService.likeAndUnlike(userDto.id, reviewId);
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


}
