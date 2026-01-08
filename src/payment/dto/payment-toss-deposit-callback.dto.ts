import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PaymentTossDepositCallbackDto {
    @ApiProperty({ description: "웹훅 생성 일시" })
    @IsNotEmpty()
    @IsString()
    createdAt: string;

    @ApiProperty({ description: "웹훅 시크릿 키" })
    @IsNotEmpty()
    @IsString()
    secret: string;

    @ApiProperty({ description: "결제 상태" })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({ description: "가상계좌 특정 거래 키" })
    @IsNotEmpty()
    @IsString()
    transactionKey: string;

    @ApiProperty({ description: "주문번호" })
    @IsNotEmpty()
    @IsString()
    orderId: string;
}