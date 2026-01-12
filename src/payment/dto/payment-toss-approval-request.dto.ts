import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PaymentTossApprovalRequestDto {
    @ApiProperty({ description: "주문번호" })
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @ApiProperty({ description: "결제 금액" })
    @IsNotEmpty()
    @IsString()
    amount: string;

    @ApiProperty({ description: "결제 키" })
    @IsNotEmpty()
    @IsString()
    paymentKey: string;

    @ApiProperty({ description: "고객 키" })
    @IsOptional()
    @IsString()
    customerKey?: string;
}