import { Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { PaymentScope } from "./enum/payment-scope.enum";
import { PaymentTermDto } from "./dto/payment-term.dto";
import { plainToInstance } from "class-transformer";
import { PaymentCheckTermsDto } from "./dto/payment-check-terms.dto";
import { PaymentAgreeTermsDto } from "./dto/payment-agree.dto";
import { v4 as uuidv4 } from 'uuid';
import { UserService } from "src/user/service/user.service";


@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
    }

    async checkTermsNotAgreed(user: User, dto: PaymentCheckTermsDto) {
        const scopeParams = dto.scope.map(scope => `scope=${scope}`).join('&');
        const findUser = await this.userService.findEntityById(user.id);
        const url = `https://api.tosspayments.com/v1/brandpay/terms?customerKey=${findUser.publicId}&${scopeParams}`
        // 인코등 btoa, 디코딩 atob
        const auth_key = btoa(`${this.configService.get('TOSS_TEST_SECRET_KEY')}:`)
        const headers = {
            'Authorization': `Basic ${auth_key}`
        }
        const response = await axios.get(url, { headers })
        return response.data as PaymentTermDto[]
    }

    async agreeTerms(user: User, dto: PaymentAgreeTermsDto) {
        const url = `https://api.tosspayments.com/v1/brandpay/terms/agree`
        const findUser = await this.userService.findEntityById(user.id);
        const idempotencyKey = uuidv4();
        const auth_key = btoa(`${this.configService.get('TOSS_TEST_SECRET_KEY')}:`)
        const headers = {
            'Authorization': `Basic ${auth_key}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey,
        }
        const body = {
            scope: dto.scope as string[],
            termsId: dto.termsId as number[],
            customerKey: findUser.publicId as string
        };
        console.log(body);
        try {
            const response = await axios.post(url, body, { headers });
            console.log(response.data);
            const accessToken = await this.getAccessToken(response.data.code, auth_key, findUser.publicId);
            return accessToken;
        } catch (error) {
            console.error('Toss Payments API Error:', error.response?.data || error.message);
            throw error;
        }
    }

    async getAccessToken(code: string, auth_key: string, publicId: string) {
        const url = `https://api.tosspayments.com/v1/brandpay/access-token`
        const headers = {
            'Authorization': `Basic ${auth_key}`,
            'Content-Type': 'application/json',
        }
        const body = {
            grantType: 'AuthorizationCode',
            code: code,
            customerKey: publicId
        }
        try{
            const response = await axios.post(url, body, { headers });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Toss Payments API Error:', error.response?.data || error.message);
            throw error;
        }
    }
}