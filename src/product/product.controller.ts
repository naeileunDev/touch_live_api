import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ProductCreateDto } from "./dto/product-create.dto";
import { Role } from "src/common/decorator/role.decorator";
import { ANY_PERMISSION } from "src/common/permission/permission";
import { ProductUpdateDto } from "./dto/product-update.dto";
import { ProductReadDto } from "./dto/product-read.dto";
import { StoreOwner } from "src/common/decorator/store-owner.decorator";

@ApiTags('Product')
@Controller('product')
@ApiBearerAuth('access-token')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @StoreOwner()
    @ApiOperation({ summary: '[스토어] 상품 생성' })
    create(@Body() productCreateDto: ProductCreateDto) {
        return this.productService.create(productCreateDto);
    }

    @Get()
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '상품 목록 조회' })
    findAll(@Query() productReadDto: ProductReadDto) {
        return this.productService.findAll(productReadDto);
    }

    @Get(':id')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '상품 상세 조회' })
    findById(@Param('id') id: number) {
        return this.productService.findById(id);
    }

    @Put(':id')
    @StoreOwner()
    @ApiOperation({ summary: '[스토어] 상품 수정' })
    updateById(@Param('id') id: number, @Body() productUpdateDto: ProductUpdateDto) {
        return this.productService.updateById(id, productUpdateDto);
    }

    @Delete(':id')
    @StoreOwner()
    @ApiOperation({ summary: '[스토어] 상품 삭제' })
    deleteById(@Param('id') id: number) {
        return this.productService.deleteById(id);
    }
}