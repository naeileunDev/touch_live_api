import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PaymentTossAccessTokenRequestDto {
    @ApiProperty({ description: "코드" })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ description: "고객 키" })
    @IsNotEmpty()
    @IsString()
    customerKey: string;
}