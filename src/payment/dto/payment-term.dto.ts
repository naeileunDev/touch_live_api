import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class PaymentTermDto {

    @ApiProperty({ description: '약관 식별자', example: '1' })
    @IsNumber()
    id: number;

    @ApiProperty({ description: '약관 제목', example: '서비스 이용약관' })
    @IsRequiredString()
    title: string; 

    @ApiProperty({ description: '약관 버전', example: '1.0' })
    @IsRequiredString()
    version: string;

    @ApiProperty({ description: '약관 URL', example: 'https://example.com/terms' })
    @IsRequiredString()
    url: string;

    @ApiProperty({ description: '필수 약관 여부', example: true })
    @IsBoolean()
    required: boolean;


    @ApiProperty({ description: '동의 여부', example: true })
    @IsBoolean()
    agreed: boolean;

}