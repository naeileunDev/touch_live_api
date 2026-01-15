import { Module } from "@nestjs/common"
import { ProductController } from "./product.controller"
import { ProductService } from "./product.service"
import { ProductRepository } from "./repository/product.respository"
import { ProductMediaRepository } from "./repository/product-media.respository"
import { ProductOptionRepository } from "./repository/product-option.respository"
import { ProductOptionDetailRepository } from "./repository/product-option-detail.respository"
import { ProductOptionDetailStockRepository } from "./repository/product-option-detail-stock.repository"
import { ProductDetailRepository } from "./repository/product-detail.repository"
import { ProductReqInfoRepository } from "./repository/product-req-info.entity"

@Module({
    controllers: [ProductController],
    providers: [
        ProductService,
        ProductRepository,
        ProductMediaRepository,
        ProductOptionRepository,
        ProductOptionDetailRepository,
        ProductOptionDetailStockRepository,
        ProductDetailRepository,
        ProductReqInfoRepository,
        
    ],
    exports: [ProductService]
})
export class ProductModule { }