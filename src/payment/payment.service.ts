import { Injectable } from "@nestjs/common";
import { User } from "src/user/entity/user.entity";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { PaymentScope } from "./enum/payment-scope.enum";
import { PaymentTermDto } from "./dto/payment-term.dto";
import { plainToInstance } from "class-transformer";
import { PaymentCheckTermsDto } from "./dto/payment-check-terms.dto";


@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
    ) {
    }

    async checkTermsNotAgreed(user: User, dto: PaymentCheckTermsDto) {
        const scopeParams = dto.scope.map(scope => `scope=${scope}`).join('&');
        const url = `https://api.tosspayments.com/v1/brandpay/terms?customerKey=${user.publicId}&${scopeParams}`
        // 인코등 btoa, 디코딩 atob
        const auth_key = btoa(`${this.configService.get('TOSS_TEST_SECRET_KEY')}:`)
        const headers = {
            'Authorization': `Basic ${auth_key}`
        }
        const response = await axios.get(url, { headers })
        return response.data as PaymentTermDto[]
    }
}