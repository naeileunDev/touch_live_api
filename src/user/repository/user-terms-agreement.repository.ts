import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { UserTermsAgreement } from "../entity/user-terms-agreement.entity";
import { UserTermsAgreementDto } from "../dto/user-terms-agreement.dto";
import { User } from "../entity/user.entity";
import { UserSignupSourceDto } from "../dto/user-signup-source.dto";

@Injectable()
export class UserTermsAgreementRepository extends Repository<UserTermsAgreement> {
    constructor(private dataSource: DataSource) {
        super(UserTermsAgreement, dataSource.createEntityManager());
    }

    async createUserTermsAgreement(createDto: UserTermsAgreementDto, user: User): Promise<UserTermsAgreement> {
        // Repository의 create() 메서드 사용
        const data = this.create({
            reqService: createDto.reqService,
            reqLocation: createDto.reqLocation,
            reqFinance: createDto.reqFinance,
            optShortform: createDto.optShortform,
            optMarketing: createDto.optMarketing,
            optThirdparty: createDto.optThirdparty,
            user: user,
        });
        return await this.save(data);
    }
}