import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethodType } from "../enum/payment-method-type.enum";
import { PaymentMethodStatusType } from "../enum/payment-method-status-type.enum";

export class PaymentMethodDto {
    @ApiProperty({ description: '결제 수단 식별자', example: 1, required: true })
    id: number;
    @ApiProperty({ description: '결제 수단 타입', example: PaymentMethodType.Card, required: true })
    methodType: PaymentMethodType;
    @ApiProperty({ description: '결제 수단 상태', example: PaymentMethodStatusType.Active, required: true })
    status: PaymentMethodStatusType;
    @ApiProperty({ description: 'PG 제공자', example: 'NICEPAY', required: false })
    pgProvider: string;
    @ApiProperty({ description: '카드 번호', example: '1234567890123456', required: false })
    cardNumberMasked: string;
    @ApiProperty({ description: '카드 브랜드', example: 'VISA', required: false })
    cardBrand: string;      
    @ApiProperty({ description: '카드 만료 월', example: 12, required: false })
    expiryMonth: number;
    @ApiProperty({ description: '카드 만료 년', example: 2025, required: false })
    expiryYear: number;
    @ApiProperty({ description: '토큰', example: '1234567890123456', required: false })
    token: string;
    @ApiProperty({ description: '토큰 타입', example: 'JWT', required: false })
    tokenType: string;
}