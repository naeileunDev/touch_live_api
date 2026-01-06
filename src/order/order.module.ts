import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./service/order.service";
import { OrderRepository } from "./repository/order.repository";
import { UserModule } from "src/user/user.module";
import { OrderProductRepository } from "./repository/order-product.repository";
import { OrderProductOptionRepository } from "./repository/order-product-detail.respository";

@Module({
    imports: [UserModule],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository, OrderProductRepository, OrderProductOptionRepository],
    exports: [OrderService],
})
export class OrderModule {}