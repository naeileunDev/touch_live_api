import { ApiProperty } from "@nestjs/swagger";
import { IsLoginId } from "src/common/validator/is-login-id";
import { IsPassword } from "src/common/validator/is-password";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class AuthPasswordResetDto {
    @ApiProperty({ description: 'NICE 세션 키' })
    @IsRequiredString()
    sessionKey: string;

    @ApiProperty({ description: '로그인 아이디' })
    @IsLoginId()
    loginId: string;

    @ApiProperty({ description: '새 비밀번호' })
    @IsPassword()
    password: string;
}