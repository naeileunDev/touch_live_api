import { ApiProperty } from "@nestjs/swagger";

export class AuthSnsLoginResponseDto {
    @ApiProperty({ description: '세션 키' })
    sessionKey: string;

    @ApiProperty({ description: '회원가입 여부' })
    isUser: boolean;
}