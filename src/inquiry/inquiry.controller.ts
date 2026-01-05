import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InquiryService } from './inquiry.service';
import { CreateProductInquiryDto, UpdateProductInquiryDto, CreateInquiryAnswerDto } from './dto/inquiry.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';

@ApiTags('Inquiry')
@Controller('inquiries')
export class InquiryController {
    constructor(private readonly inquiryService: InquiryService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '상품 문의 등록' })
    async create(
        @GetUser('id') userId: number,
        @Body() dto: CreateProductInquiryDto,
    ) {
        return this.inquiryService.createInquiry(userId, dto);
    }

    @Get('product/:productId')
    @ApiOperation({ summary: '상품별 문의 목록' })
    async getByProduct(
        @Param('productId', ParseIntPipe) productId: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.inquiryService.getInquiries(productId, page, limit);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '내 문의 목록' })
    async getMyInquiries(
        @GetUser('id') userId: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.inquiryService.getMyInquiries(userId, page, limit);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '문의 상세 조회' })
    async getOne(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number,
    ) {
        return this.inquiryService.getInquiry(id, userId);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '문의 수정' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number,
        @Body() dto: UpdateProductInquiryDto,
    ) {
        return this.inquiryService.updateInquiry(id, userId, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '문의 삭제' })
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('id') userId: number,
    ) {
        return this.inquiryService.deleteInquiry(id, userId);
    }

    @Post(':id/answer')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '문의 답변 등록 (판매자)' })
    async createAnswer(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('storeId') storeId: number,
        @Body() dto: CreateInquiryAnswerDto,
    ) {
        return this.inquiryService.createAnswer(id, storeId, dto);
    }
}
