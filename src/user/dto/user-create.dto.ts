import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "../enum/user-role.enum";

export class UserCreateDto {
    @ApiProperty({ description: '로그인 아이디'  })
    @IsNotEmpty()
    @IsString()
    loginId: string;

    @ApiProperty({ description: '비밀번호' })
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @ApiProperty({ description: '나이스 인증 세션키' })
    @IsNotEmpty()
    @IsString()
    sessionKey: string;

    @ApiProperty({ description: 'FCM 토큰' })
    @IsOptional()
    @IsString()
    fcmToken: string;

    @ApiProperty({ description: '이메일' })
    @IsOptional()
    @IsString()
    email?: string;

    name: string;

    phone: string;

    gender: string;

    birth: string;

    di: string;

    role: UserRole;
}