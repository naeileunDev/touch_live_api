import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { Controller, Get } from "@nestjs/common";
import { Role } from "src/common/decorator/role.decorator";
import { ANY_PERMISSION } from "src/common/permission/permission";
import { ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { ProductDto } from "./dto/product.dto";

@ApiTags('Product')
@Controller('product')
@ApiBearerAuth('access-token')
export class ProductController {
    constructor(private readonly productService: ProductService) {
     }

     @Get('list')
     @Role(ANY_PERMISSION)
     @ApiOperation({ summary: '상품 목록 조회' })
     @ApiOkSuccessResponse(ProductDto, '상품 목록 조회 성공')
     list() {
       return "일단 연결"
     }

    }