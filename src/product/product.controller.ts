import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, ProductListQueryDto } from './dto/product.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';

@ApiTags('Product')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '상품 등록' })
    async create(
        @GetUser('storeId') storeId: number,
        @Body() dto: CreateProductDto,
    ) {
        return this.productService.create(storeId, dto);
    }

    @Get()
    @ApiOperation({ summary: '상품 목록 조회' })
    async findAll(@Query() query: ProductListQueryDto) {
        return this.productService.findAll(query);
    }

    @Get('store/:storeId')
    @ApiOperation({ summary: '스토어별 상품 목록' })
    async getByStore(
        @Param('storeId', ParseIntPipe) storeId: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.productService.getByStore(storeId, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: '상품 상세 조회' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        await this.productService.incrementViewCount(id);
        return this.productService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '상품 수정' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto,
    ) {
        return this.productService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '상품 삭제' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id);
    }
}
