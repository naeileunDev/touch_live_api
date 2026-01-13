import { ApiProperty } from "@nestjs/swagger";
import { PaymentTossBrandpayBankAccountDto } from "./payment-toss-brandpay-bank-account.dto";
import { PaymentTossBrandpayCardDto } from "./payment-toss-brandpay-card.dto";

export class PaymentTossBrandpayMethodDto {
    @ApiProperty({ description: '선택된 결제수단 ID' })
    selectedMethodId: string;

    @ApiProperty({ description: '카드 목록' })
    cards: PaymentTossBrandpayCardDto[];

    @ApiProperty({ description: '계좌 목록' })
    accounts: PaymentTossBrandpayBankAccountDto[];
}