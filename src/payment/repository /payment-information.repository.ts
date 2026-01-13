import { DataSource, Repository } from "typeorm";
import { PaymentInformation } from "../entity /payment-information.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentInformationRepository extends Repository<PaymentInformation> {
    constructor(private readonly dataSource: DataSource) {
        super(PaymentInformation, dataSource.createEntityManager());
    }
}