import { plainToInstance } from "class-transformer";
import { PaymentMethodDto } from "./dto/payment-method.dto";
import { PaymentMethodRepository } from "./repository/payment-method.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentMethodService {
    constructor(
        private readonly paymentMethodRepository: PaymentMethodRepository
    ) {
    }
    async findPaymentMethodAllByUserId(id: string): Promise<PaymentMethodDto[]> {
        const paymentMethods = await this.paymentMethodRepository.findAllByUserId(id);
        if (!paymentMethods) {
            return [];
        }
        return plainToInstance(PaymentMethodDto, paymentMethods);
    }
}