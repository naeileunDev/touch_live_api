import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { BannerPosition } from 'src/common/enums';

@ApiTags('Banner')
@Controller('banners')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '배너 등록 (관리자)' })
    async create(@Body() dto: CreateBannerDto) {
        return this.bannerService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: '배너 목록 조회' })
    async findAll(@Query('position') position?: BannerPosition) {
        return this.bannerService.findAll(position);
    }

    @Get(':id')
    @ApiOperation({ summary: '배너 상세 조회' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bannerService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '배너 수정 (관리자)' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBannerDto,
    ) {
        return this.bannerService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '배너 삭제 (관리자)' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.bannerService.remove(id);
    }
}
