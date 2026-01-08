import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class PaymentTossCardDto {
    @ApiProperty({ description: "결제 금액", example: 500 })
    amount: number;

    @ApiPropertyOptional({ description: "카드 발급사 코드", example: "24" })
    issuerCode?: string;

    @ApiPropertyOptional({ description: "카드 매입사 코드", example: "21" })
    acquirerCode?: string;

    @ApiProperty({ description: "마스킹된 카드 번호", example: "53275074****019*" })
    number: string;

    @ApiProperty({ description: "할부 개월 수", example: 0 })
    installmentPlanMonths: number;

    @ApiProperty({ description: "무이자 여부", example: false })
    isInterestFree: boolean;

    @ApiPropertyOptional({ description: "무이자 부담 주체", example: null })
    interestPayer?: string | null;

    @ApiPropertyOptional({ description: "승인 번호", example: "00000000" })
    approveNo?: string;

    @ApiProperty({ description: "카드 포인트 사용 여부", example: false })
    useCardPoint: boolean;

    @ApiPropertyOptional({ description: "카드 종류", example: "신용" })
    cardType?: string;

    @ApiPropertyOptional({ description: "소유주 유형", example: "개인" })
    ownerType?: string;

    @ApiPropertyOptional({ description: "매입 상태", example: "READY" })
    acquireStatus?: string;
}

export class PaymentTossEasyPayDto {
    @ApiProperty({ description: "간편결제 제공사", example: "토스페이" })
    provider: string;

    @ApiProperty({ description: "간편결제 금액", example: 0 })
    amount: number;

    @ApiProperty({ description: "할인 금액", example: 0 })
    discountAmount: number;
}

export class PaymentTossReceiptDto {
    @ApiProperty({ description: "영수증 URL", example: "https://dashboard-sandbox.tosspayments.com/receipt/redirection?transactionId=tgen_20260106142459td5e6&ref=PX" })
    url: string;
}

export class PaymentTossCheckoutDto {
    @ApiProperty({ description: "체크아웃 URL", example: "https://api.tosspayments.com/v1/payments/tgen_20260106142459td5e6/checkout" })
    url: string;
}

export class PaymentTossApprovalResultDto {
    @ApiProperty({ description: "상점 아이디", example: "tgen_docs" })
    mId: string;

    @ApiPropertyOptional({ description: "마지막 트랜잭션 키", example: "txrd_a01ke8w8c28vsnsm4g8js8kn126" })
    lastTransactionKey?: string;

    @ApiProperty({ description: "결제 키", example: "tgen_20260106142459td5e6" })
    paymentKey: string;

    @ApiProperty({ description: "주문 아이디", example: "W2cNkbdJdNenbHSPTPTHq" })
    orderId: string;

    @ApiProperty({ description: "주문명", example: "토스 티셔츠 외 2건" })
    orderName: string;

    @ApiProperty({ description: "면세 금액", example: 0 })
    taxExemptionAmount: number;

    @ApiProperty({ description: "결제 상태", example: "DONE" })
    status: string;

    @ApiProperty({ description: "요청 시각", example: "2026-01-06T14:24:59+09:00" })
    requestedAt: Date;

    @ApiProperty({ description: "승인 시각", example: "2026-01-06T14:25:11+09:00" })
    approvedAt: Date;

    @ApiProperty({ description: "에스크로 사용 여부", example: false })
    useEscrow: boolean;

    @ApiProperty({ description: "문화비 지출 여부", example: false })
    cultureExpense: boolean;

    @ApiPropertyOptional({ description: "카드 결제 정보", type: () => PaymentTossCardDto })
    @Type(() => PaymentTossCardDto)
    card?: PaymentTossCardDto | null;

    @ApiPropertyOptional({ description: "가상계좌 정보", example: null, type: Object })
    virtualAccount?: unknown | null;

    @ApiPropertyOptional({ description: "계좌이체 정보", example: null, type: Object })
    transfer?: unknown | null;

    @ApiPropertyOptional({ description: "휴대폰 결제 정보", example: null, type: Object })
    mobilePhone?: unknown | null;

    @ApiPropertyOptional({ description: "상품권 결제 정보", example: null, type: Object })
    giftCertificate?: unknown | null;

    @ApiPropertyOptional({ description: "현금영수증 정보", example: null, type: Object })
    cashReceipt?: unknown | null;

    @ApiPropertyOptional({ description: "현금영수증 목록", example: null, type: Object })
    cashReceipts?: unknown | null;

    @ApiPropertyOptional({ description: "할인 정보", example: null, type: Object })
    discount?: unknown | null;

    @ApiPropertyOptional({ description: "취소 내역", example: null, type: Object })
    cancels?: unknown | null;

    @ApiProperty({ description: "비밀 키", example: "ps_P9BRQmyarYGOvLEDL4J73J07KzLN" })
    secret: string;

    @ApiProperty({ description: "결제 타입", example: "NORMAL" })
    type: string;

    @ApiPropertyOptional({ description: "간편결제 정보", type: () => PaymentTossEasyPayDto })
    @Type(() => PaymentTossEasyPayDto)
    easyPay?: PaymentTossEasyPayDto | null;

    @ApiProperty({ description: "국가 코드", example: "KR" })
    country: string;

    @ApiPropertyOptional({ description: "실패 정보", example: null, type: Object })
    failure?: unknown | null;

    @ApiProperty({ description: "부분 취소 가능 여부", example: true })
    isPartialCancelable: boolean;

    @ApiPropertyOptional({ description: "영수증 정보", type: () => PaymentTossReceiptDto })
    @Type(() => PaymentTossReceiptDto)
    receipt?: PaymentTossReceiptDto | null;

    @ApiPropertyOptional({ description: "체크아웃 정보", type: () => PaymentTossCheckoutDto })
    @Type(() => PaymentTossCheckoutDto)
    checkout?: PaymentTossCheckoutDto | null;

    @ApiProperty({ description: "통화", example: "KRW" })
    currency: string;

    @ApiProperty({ description: "총 결제 금액", example: 500 })
    totalAmount: number;

    @ApiProperty({ description: "잔액", example: 500 })
    balanceAmount: number;

    @ApiProperty({ description: "공급가액", example: 455 })
    suppliedAmount: number;

    @ApiProperty({ description: "부가세", example: 45 })
    vat: number;

    @ApiProperty({ description: "면세 금액", example: 0 })
    taxFreeAmount: number;

    @ApiProperty({ description: "결제 수단", example: "간편결제" })
    method: string;

    @ApiProperty({ description: "응답 버전", example: "2022-11-16" })
    version: Date;

    @ApiPropertyOptional({ description: "메타데이터", example: null, type: Object })
    metadata?: unknown | null;
}