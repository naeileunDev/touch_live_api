import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./service/order.service";
import { OrderRepository } from "./repository/order.repository";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [UserModule],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository],
    exports: [OrderService],
})
export class OrderModule {}