import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { BannerPosition } from 'src/common/enums';
import { Role } from 'src/common/decorator/role.decorator';
import { ANY_PERMISSION, OPERATOR_PERMISSION } from 'src/common/permission/permission';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@ApiTags('Banner')
@Controller('banners')
@ApiBearerAuth('access-token')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Post()
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '배너 등록 (관리자)' })
    create(@Body() dto: CreateBannerDto) {
        return this.bannerService.create(dto);
    }

    @Get()
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '배너 목록 조회' })
    findAll(@Query('position') position?: BannerPosition) {
        return this.bannerService.findAll(position);
    }

    @Get(':id')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '배너 상세 조회' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bannerService.findOne(id);
    }

    @Put(':id')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '배너 수정 (관리자)' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBannerDto,
    ) {
        return this.bannerService.update(id, dto);
    }

    @Delete(':id')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '배너 삭제 (관리자)' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bannerService.remove(id);
    }
}
