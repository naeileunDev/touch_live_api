import { ApiProperty } from "@nestjs/swagger";

export class PaymentRefundReceiveAccountDto {
    @ApiProperty({ description: "은행 코드", example: "23" })
    bank: string;

    @ApiProperty({ description: "계좌 번호", example: "1234567890" })
    accountNumber: string;

    @ApiProperty({ description: "예금주 이름", example: "홍길동" })
    holderName: string;
}