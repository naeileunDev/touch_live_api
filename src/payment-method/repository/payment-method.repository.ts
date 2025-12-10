import { DataSource, Repository } from "typeorm";
import { PaymentMethod } from "../entity/payment-method.entity";
import { Injectable } from "@nestjs/common";
import { PaymentMethodDto } from "../dto/payment-method.dto";

@Injectable()
export class PaymentMethodRepository extends Repository<PaymentMethod> {
    constructor(private dataSource: DataSource) {
        super(PaymentMethod, dataSource.createEntityManager());
    }

    async findAllByUserId(id: string): Promise<PaymentMethod[]> {
        return await this.find({
            where: {
                user: { publicId: id },
            },
            relations: ['user'],
            order: {
                createdAt: 'DESC'
            },
        });
    }
}