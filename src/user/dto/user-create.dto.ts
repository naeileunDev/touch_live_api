import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserGender } from "../enum/user-gender.enum";
import { UserRole } from "../enum/user-role.enum";

export class UserCreateDto {
    @ApiProperty({ description: '로그인 아이디', example: 'test' })
    @IsNotEmpty()
    @IsString()
    loginId: string;

    @ApiProperty({ description: '비밀번호', example: 'test' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ description: '닉네임', example: '홍길동' })
    @IsNotEmpty()
    @IsString()
    nickname: string;
    
    @ApiProperty({ description: '나이스 인증 세션키', example: 'test' })
    @IsNotEmpty()
    @IsString()
    sessionKey: string;

    @ApiProperty({ description: 'FCM 토큰', example: '토큰' })
    @IsOptional()
    @IsString()
    fcmToken: string;

    @ApiProperty({ description: '이메일', example: 'test@test.com' })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ description: '이름', example: '홍길동' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '전화번호', example: '01012345678' })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({ description: '성별', example: UserGender.Male })
    @IsEnum(UserGender)
    gender: UserGender;

    @ApiProperty({ description: '생년월일', example: '1990-01-01' })
    @IsNotEmpty()
    @IsString()
    birth: string;

    @ApiProperty({ description: 'DI', example: 'DI' })
    di: string;


    @ApiProperty({ description: '권한', enum: UserRole, default: UserRole.User })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.User;
}