import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PaymentTossApprovalRequestDto } from "./dto/payment-toss-approval-request.dto";
import { PaymentTossDepositCallbackDto } from "./dto/payment-toss-deposit-callback.dto";
import { PaymentTossAccessTokenRequestDto } from "./dto/payment-toss-access-token-request.dto";
import { PaymentTossApprovalRequestFailDto } from "./dto/payment-toss-approval-request-fail.dto";

@Controller('payment')
@ApiTags('Payment')
@ApiBearerAuth('access-token')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get('toss/confirm/redirect')
    @ApiOperation({ summary: 'Toss 결제 승인 리다이렉트' })
    tossConfirmRedirect(@Query() paymentTossApprovalRequestDto: PaymentTossApprovalRequestDto) {
        return this.paymentService.confirmTossPayment(paymentTossApprovalRequestDto);
    }

    @Get('toss/confirm/brandpay/redirect')
    @ApiOperation({ summary: 'Toss Brandpay 결제 승인 리다이렉트' })
    tossBrandpayConfirmRedirect(@Query() paymentTossApprovalRequestDto: PaymentTossApprovalRequestDto) {
        return this.paymentService.confirmTossPayment(paymentTossApprovalRequestDto);
    }

    @Get('toss/confirm/fail/redirect')
    @ApiOperation({ summary: 'Toss 결제 실패 리다이렉트' })
    tossFailRedirect(@Query() paymentTossApprovalRequestFailDto: PaymentTossApprovalRequestFailDto) {
        return this.paymentService.failTossPayment(paymentTossApprovalRequestFailDto);
    }

    @Get('toss/brandpay/access-token')
    @ApiOperation({ summary: 'Toss Brandpay 액세스 토큰 발급' })
    getAccessToken(@Query() paymentTossAccessTokenRequestDto: PaymentTossAccessTokenRequestDto) {
        return this.paymentService.getAccessToken(paymentTossAccessTokenRequestDto);
    }

    @Get('toss/brandpay/method')
    @ApiOperation({ summary: 'Toss Brandpay 결제 수단 조회' })
    getTossBrandpayMethod() {
        return this.paymentService.getTossBrandpayMethod();
    }

    @Post('toss/deposit/callback')
    @ApiExcludeEndpoint()
    @ApiOperation({ summary: 'Toss 가상계좌 입금 상태 변경 콜백' })
    tossDepositCallback(@Body() paymentTossDepositCallbackDto: PaymentTossDepositCallbackDto) {
        return this.paymentService.confirmTossDeposit(paymentTossDepositCallbackDto);
    }
}