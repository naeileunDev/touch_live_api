import { ApiProperty } from "@nestjs/swagger";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class AuthAppleLoginDto {
    @ApiProperty({ description: 'Apple 로그인 코드' })
    @IsRequiredString()
    code: string;
}