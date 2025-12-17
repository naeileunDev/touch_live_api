import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthPasswordResetDto {
    @ApiProperty({ description: 'NICE 세션 키' })
    @IsString({always: true})
    sessionKey: string;

    @ApiProperty({ description: '로그인 아이디' })
    @IsString({always: true})
    loginId: string;

    @ApiProperty({ description: '새 비밀번호' })
    @IsString({always: true})
    password: string;
}