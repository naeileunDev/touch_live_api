import { Module } from "@nestjs/common";
import { PaymentMethodController } from "./payment-method.controller";
import { PaymentMethodService } from "./payment-method.service";
import { PaymentMethodRepository } from "./repository/payment-method.repository";

@Module({
    controllers: [PaymentMethodController],
    providers: [PaymentMethodService, PaymentMethodRepository],
    exports: [PaymentMethodService],
})
export class PaymentMethodModule {}