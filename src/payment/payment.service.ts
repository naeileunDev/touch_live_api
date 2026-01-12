import { ConflictException, Injectable } from "@nestjs/common";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { plainToInstance } from "class-transformer";
import { PaymentTossApprovalResultDto } from "./dto/payment-toss-approval-result.dto";
import { PaymentRefundReceiveAccountDto } from "./dto/payment-refund-receive-account.dto";
import { PaymentTossApprovalRequestDto } from "./dto/payment-toss-approval-request.dto";
import { PaymentTossDepositCallbackDto } from "./dto/payment-toss-deposit-callback.dto";
import { PaymentTossAccessTokenRequestDto } from "./dto/payment-toss-access-token-request.dto";
import { PaymentTossBrandpayCardDto } from "./dto/payment-toss-brandpay-card.dto";
import { PaymentTossBrandpayBankAccountDto } from "./dto/payment-toss-brandpay-bank-account.dto";
import { PaymentTossBrandpayMethodDto } from "./dto/payment-toss-brandpay-method.dto";
import { PaymentTossCancelResultDto } from "./dto/payment-toss-cancel-result.dto";
import { PaymentTossApprovalRequestFailDto } from "./dto/payment-toss-approval-request-fail.dto";


@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    private readonly secretKey = this.configService.get('TOSS_SECRET_KEY');
    private readonly encryptedSecretKey = "Basic " + Buffer.from(this.secretKey + ":").toString("base64");

    /**
     * Toss Brandpay 액세스 토큰 발급
     * @param code - 인가 코드
     * @param customerKey - 고객 키
     */
    async getAccessToken(paymentTossAccessTokenRequestDto: PaymentTossAccessTokenRequestDto) {
        const url = `https://api.tosspayments.com/v1/brandpay/authorizations/access-token`
        const headers = {
            // Brandpay 액세스 토큰 발급은 시크릿 키를 Basic 인코딩하여 사용
            'Authorization': this.encryptedSecretKey,
            'Content-Type': 'application/json',
        }
        const body = {
            customerKey: paymentTossAccessTokenRequestDto.customerKey,
            code: paymentTossAccessTokenRequestDto.code,
            grantType: 'AuthorizationCode',
        }
        const response = await axios.post(url, body, { headers });

        if (response.status !== 200) {
            throw new ConflictException("Toss Brandpay 액세스 토큰 발급 실패");
        }

        return response.data;
    }

    /**
     * Toss 결제 승인
     * @param orderId - 주문 ID
     * @param amount - 결제 금액
     * @param paymentKey - 결제 키
     */
    async confirmTossPayment(paymentTossApprovalRequestDto: PaymentTossApprovalRequestDto): Promise<PaymentTossApprovalResultDto> {
        // TODO: 금액 검증
        // 결제 승인 요청
        const url = 'https://api.tosspayments.com/v1/payments/confirm';
        const headers = {
            'Authorization': this.encryptedSecretKey,
        }
        const body = {
            orderId: paymentTossApprovalRequestDto.orderId,
            amount: paymentTossApprovalRequestDto.amount,
            paymentKey: paymentTossApprovalRequestDto.paymentKey,
            customerKey: paymentTossApprovalRequestDto.customerKey ?? undefined, // 브랜드페이 결제 승인시 필요
        }
        const response = await axios.post(url, body, { headers });

        if (response.status !== 200) {
            throw new ConflictException("결제 승인 요청 실패");
        }

        const approvalResult = plainToInstance(PaymentTossApprovalResultDto, response.data);

        // DONE: 결제 완료, WAITING_FOR_DEPOSIT: 입금 대기
        if(approvalResult.status !== 'DONE' && approvalResult.status !== 'WAITING_FOR_DEPOSIT') {
            throw new ConflictException("결제 승인 실패");
        }
        
        // TODO: 결제 승인 이후 주문 상태 업데이트
        return approvalResult;
    }

    /**
     * Toss 결제 요청 실패
     * @param paymentTossApprovalRequestFailDto - 결제 실패 요청
     */
    async failTossPayment(paymentTossApprovalRequestFailDto: PaymentTossApprovalRequestFailDto): Promise<void> {
        // TODO: 결제 요청 실패 이후 주문 상태 업데이트 또는 삭제
    }

    /**
     * Toss 결제 취소
     * @param paymentKey - 결제 키
     */
    async cancelTossPayment(orderNo: string, cancelReason: string, refundReceiveAccount?: PaymentRefundReceiveAccountDto): Promise<PaymentTossCancelResultDto> {
        // 주문번호로 토스페이먼츠 결제 조회
        const tossPayment = await this.getTossPaymentByOrderId(orderNo);

        // 결제 취소 요청
        const url = `https://api.tosspayments.com/v1/payments/${tossPayment.paymentKey}/cancel`;
        const headers = {
            'Authorization': this.encryptedSecretKey,
        }
        const body = {
            cancelReason, // 필수
            currency: tossPayment.currency, // 통화 / 일반결제는 KRW, USD, JPY를 지원합니다. 해외 간편결제(PayPal)는 USD만 지원합니다.(선택)
            refundReceiveAccount: refundReceiveAccount ?? undefined, // 환불 받을 계좌 정보 (선택)
            // cancelAmount: 100, // 취소할 금액 / 값이 없으면 전액 취소 (선택)
        }
        const response = await axios.post(url, body, { headers });

        if (response.status !== 200) {
            throw new ConflictException("결제 취소 요청 실패");
        }

        const cancelResult: PaymentTossCancelResultDto = response.data.cancels[0];
        if (cancelResult.cancelStatus !== "DONE") {
            throw new ConflictException("결제 취소 실패");
        }
        // TODO: 결제 취소 이후 주문 상태 업데이트
        return cancelResult;
    }

    /**
     * 주문번호로 토스페이먼츠 결제 조회
     * @param orderNo - 주문 ID
     */
    async getTossPaymentByOrderId(orderNo: string): Promise<PaymentTossApprovalResultDto> {
        const url = `https://api.tosspayments.com/v1/payments/orders/${orderNo}`;
        const headers = {
            'Authorization': this.encryptedSecretKey,
        }
        const response = await axios.get(url, { headers });

        if (response.status !== 200) {
            throw new ConflictException("Toss 결제 조회 실패");
        }

        return plainToInstance(PaymentTossApprovalResultDto, response.data);
    }

    /**
     * Toss Brandpay 결제 수단 조회
     */
    async getTossBrandpayMethod(): Promise<PaymentTossBrandpayMethodDto> {
        const customerKey = 'MC4zMDYwMzI3OTk4NTY1';
        const url = `https://api.tosspayments.com/v1/brandpay/payments/methods/${customerKey}`;
        const headers = {
            'Authorization': this.encryptedSecretKey,
        }
        const response = await axios.get(url, { headers });

        if (response.status !== 200) {
            throw new ConflictException("Toss Brandpay 결제 수단 조회 실패");
        }

        return {
            selectedMethodId: response.data.selectedMethodId,
            cards: response.data.cards.map((card: any) => new PaymentTossBrandpayCardDto(card)),
            accounts: response.data.accounts.map((account: any) => new PaymentTossBrandpayBankAccountDto(account)),
        }
    }

    /**
     * Toss 가상계좌 입금 알림 콜백
     * @param paymentTossDepositCallbackDto - 가상계좌 입금 알림 콜백 요청 바디
     */
    async confirmTossDeposit(paymentTossDepositCallbackDto: PaymentTossDepositCallbackDto) {
        const { secret, status, orderId } = paymentTossDepositCallbackDto;
        // 주문번호로 토스페이먼츠 결제 조회
        const tossPayment = await this.getTossPaymentByOrderId(orderId);

        // 웹훅 시크릿 키로 결제 승인 응답으로 돌아온 secret 과 같은지 웹훅 검증
        if (secret !== tossPayment.secret) {
            throw new ConflictException("정상적인 웹훅 요청이 아닙니다.");
        }

        switch (status) {
            case 'DONE': // 입금 완료
                break;
            case 'CANCELED': // 입금 전 취소, 결제 취소
                break;
            case 'WAITING_FOR_DEPOSIT': // 입금 오류, 입금 기한 만료 (구매자에게 다시 입금하도록 안내해야 합니다.)
                break;
            case 'PARTIAL_CANCELED': // 부분 취소 (부분 취소 기획 보류)
                break;
        }
    }
}