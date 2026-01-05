import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { CreateSearchHistoryDto } from './dto/search.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { SearchType } from 'src/common/enums';

@ApiTags('Search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Post('history')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '검색 기록 저장' })
    async saveHistory(
        @GetUser('id') userId: number,
        @Body() dto: CreateSearchHistoryDto,
    ) {
        return this.searchService.saveHistory(userId, dto);
    }

    @Get('history')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '검색 기록 조회' })
    async getHistory(
        @GetUser('id') userId: number,
        @Query('searchType') searchType?: SearchType,
        @Query('limit') limit?: number,
    ) {
        return this.searchService.getHistory(userId, searchType, limit);
    }

    @Delete('history/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '검색 기록 삭제' })
    async deleteHistory(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.searchService.deleteHistory(userId, id);
    }

    @Delete('history')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '검색 기록 전체 삭제' })
    async clearHistory(
        @GetUser('id') userId: number,
        @Query('searchType') searchType?: SearchType,
    ) {
        return this.searchService.clearHistory(userId, searchType);
    }

    @Get('popular')
    @ApiOperation({ summary: '인기 검색어' })
    async getPopularKeywords(
        @Query('searchType') searchType: SearchType,
        @Query('limit') limit?: number,
    ) {
        return this.searchService.getPopularKeywords(searchType, limit);
    }
}
