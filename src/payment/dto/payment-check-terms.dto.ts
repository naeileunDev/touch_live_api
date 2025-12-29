import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, ArrayMaxSize, ArrayMinSize } from "class-validator";
import { Transform } from "class-transformer";
import { PaymentScope } from "../enum/payment-scope.enum";

export class PaymentCheckTermsDto {
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
}