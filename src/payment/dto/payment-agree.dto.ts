import { ApiProperty } from "@nestjs/swagger";
import { PaymentScope } from "../enum/payment-scope.enum";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class PaymentAgreeTermsDto {
    @ApiProperty({
        description: '결제 약관 범위 (최소1개, 최대 2개)',
        example: [PaymentScope.Register, PaymentScope.Account],
        enum: PaymentScope,
        isArray: true,
    })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    @IsEnum(PaymentScope, { each: true })
    @Transform(({ value }) => {
        if (!value) return undefined;
        return Array.isArray(value) ? value : [value];
    })
    scope: PaymentScope[];

    @ApiProperty({ description: '약관 식별자', example: [1, 2, 3, 4, 5] })
    @IsArray()
    @IsNumber({}, { each: true })
    termsId: number[];
}