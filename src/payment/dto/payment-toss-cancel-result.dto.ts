import { ApiProperty } from "@nestjs/swagger";

export class PaymentTossCancelResultDto {
    @ApiProperty({ description: '취소 거래 키' })
    transactionKey: string;

    @ApiProperty({ description: '취소 이유' })
    cancelReason: string;

    @ApiProperty({ description: '취소된 금액 중 과세 제외 금액(컵 보증금 등)' })
    taxExemptionAmount: number;

    @ApiProperty({ description: '취소 일시' })
    canceledAt: Date;

    @ApiProperty({ description: '퀵계좌이체 서비스의 즉시할인에서 취소된 금액' })
    transferDiscountAmount: number;

    @ApiProperty({ description: '간편결제 서비스의 포인트, 쿠폰, 즉시할인과 같은 적립식 결제수단에서 취소된 금액' })
    easyPayDiscountAmount: number;

    @ApiProperty({ description: '현금 영수증 키' })
    receiptKey: string | null;

    @ApiProperty({ description: '취소 금액' })
    cancelAmount: number;

    @ApiProperty({ description: '취소된 금액 중 면세 금액' })
    taxFreeAmount: number;

    @ApiProperty({ description: '환불 가능 금액' })
    refundableAmount: number;

    @ApiProperty({ description: '취소 상태 (DONE: 취소 완료)' })
    cancelStatus: string;

    @ApiProperty({ description: '취소 요청 ID' })
    cancelRequestId: string | null;
}