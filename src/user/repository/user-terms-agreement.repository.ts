import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserTermsAgreement } from "../entity/user-terms-agreement.entity";
import { UserTermsAgreementDto } from "../dto/user-terms-agreement.dto";
import { User } from "../entity/user.entity";

@Injectable()
export class UserTermsAgreementRepository extends Repository<UserTermsAgreement> {
    constructor(private dataSource: DataSource) {
        super(UserTermsAgreement, dataSource.createEntityManager());
    }

    async createUserTermsAgreement(createDto: UserTermsAgreementDto, user: User): Promise<UserTermsAgreement> {
        const data = this.create(createDto);
        data.user = user;
        return await this.save(data);
    }
}