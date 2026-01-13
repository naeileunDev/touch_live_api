import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PaymentTossApprovalRequestFailDto {
    @ApiProperty({ description: "주문번호" })
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @ApiProperty({ description: "실패 메시지" })
    @IsNotEmpty()
    @IsString()
    message: string;

    @ApiProperty({ description: "실패 코드" })
    @IsNotEmpty()
    @IsString()
    code: string;
}