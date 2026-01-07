import { Module } from "@nestjs/common"
import { ProductController } from "./product.controller"
import { ProductService } from "./product.service"
import { ProductRepository } from "./repository/product.respository"
import { ProductCategoryRepository } from "./repository/product-category.repository"
import { ProductMediaRepository } from "./repository/product-media.respository"
import { ProductOptionRepository } from "./repository/product-option.respository"
import { ProductOptionDetailRepository } from "./repository/product-option-detail.respository"
import { ProductStockRepository } from "./repository/product-stock.respository"
import { ProductOptionDetailStockRepository } from "./repository/product-option-detail-stock.repository"

@Module({
    controllers: [ProductController],
    providers: [
        ProductService,
        ProductRepository,
        ProductStockRepository,
        ProductCategoryRepository,
        ProductMediaRepository,
        ProductOptionRepository,
        ProductOptionDetailRepository,
        ProductOptionDetailStockRepository,
    ],
    exports: [ProductService]
})
export class ProductModule { }