import { Module } from "@nestjs/common"
import { ProductController } from "./product.controller"
import { ProductService } from "./product.service"
import { ProductRepository } from "./repository/product.respository"
import { ProductMediaRepository } from "./repository/product-media.respository"
import { ProductOptionRepository } from "./repository/product-option.respository"
import { ProductOptionDetailRepository } from "./repository/product-option-detail.respository"
import { ProductOptionDetailStockRepository } from "./repository/product-option-detail-stock.repository"
import { ProductFlexibleRepository } from "./repository/product-flexible.repository"
import { ProductReqInfoService } from "./service/product-req-info.service"
import { ProductReqInfoRepository } from "./repository/product-req-info.repository"
// import { StoreModule } from "src/store/store.module"

@Module({
    // imports: [StoreModule],
    controllers: [ProductController],
    providers: [
        ProductService,
        ProductRepository,
        ProductMediaRepository,
        ProductOptionRepository,
        ProductOptionDetailRepository,
        ProductOptionDetailStockRepository,
        ProductFlexibleRepository,
        ProductReqInfoService,
        ProductReqInfoRepository,
    ],
    exports: [ProductService]
})
export class ProductModule { }