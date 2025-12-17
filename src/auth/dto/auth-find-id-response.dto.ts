import { ApiProperty } from "@nestjs/swagger";

export class AuthFindIdResponseDto {
    @ApiProperty({ description: '사용자 로그인 아이디', example: 'test' })
    loginId?: string;

    constructor(loginId?: string) {
        this.loginId = loginId;
    }
}