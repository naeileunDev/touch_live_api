import { ApiProperty } from "@nestjs/swagger";

export class AuthAppleLoginDto {
    @ApiProperty({ description: 'Apple 로그인 코드' })
    code: string;
}