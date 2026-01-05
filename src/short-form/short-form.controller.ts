import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShortFormService } from './short-form.service';
import { ShortFormRecommendationService } from './short-form-recommendation.service';
import { CreateShortFormDto, UpdateShortFormDto, ShortFormListQueryDto } from './dto/short-form.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';

@ApiTags('ShortForm')
@Controller('short-forms')
export class ShortFormController {
    constructor(
        private readonly shortFormService: ShortFormService,
        private readonly recommendationService: ShortFormRecommendationService,
    ) {}

    /**
     * 숏폼 등록 
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '숏폼 등록' })
    async create(
        @GetUser('storeId') storeId: number,
        @Body() dto: CreateShortFormDto,
    ) {
        return this.shortFormService.create(storeId, dto);
    }

    /**
     * 숏폼 목록 조회
     */
    @Get()
    @ApiOperation({ summary: '숏폼 목록 조회' })
    async findAll(@Query() query: ShortFormListQueryDto) {
        return this.shortFormService.findAll(query);
    }

    /**
     * 추천 숏폼 목록 (로그인 사용자)
     * 
     * 점수 기반 추천 알고리즘 적용:
     * - 사용자 히스토리 50% (검색 15%, 시청 30%, 팔로잉 5%)
     * - 동일 연령대 인기 30%
     * - 전체 인기 (판매량) 15%
     * - 신규 콘텐츠 5%
     */
    @Get('recommended')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '추천 숏폼 목록 (개인화)' })
    async getRecommendedForUser(
        @GetUser('id') userId: number,
        @Query('limit') limit?: number,
    ) {
        return this.recommendationService.getRecommendedShortForms(userId, limit || 20);
    }

    /**
     * 추천 숏폼 목록 (비로그인 사용자)
     * 
     * 단순 인기순 정렬 (조회수 + 좋아요*2)
     */
    @Get('recommended/guest')
    @ApiOperation({ summary: '추천 숏폼 목록 (비로그인, 인기순)' })
    async getRecommendedForGuest(@Query('limit') limit?: number) {
        return this.shortFormService.getRecommended(limit || 20);
    }


    /**
     * 스토어별 숏폼 목록
     */
    @Get('store/:storeId')
    @ApiOperation({ summary: '스토어별 숏폼 목록' })
    async getByStore(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.shortFormService.getByStore(storeId, page, limit);
    }

    /**
     * 숏폼 상세 조회
     */
    @Get(':id')
    @ApiOperation({ summary: '숏폼 상세 조회' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        await this.shortFormService.incrementViewCount(id);
        return this.shortFormService.findOne(id);
    }

    /**
     * 숏폼 수정
     */
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '숏폼 수정' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateShortFormDto,
    ) {
        return this.shortFormService.update(id, dto);
    }

    /**
     * 숏폼 삭제
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '숏폼 삭제' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.shortFormService.remove(id);
    }
}
