import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
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
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({ description: '전화번호', example: '01012345678' })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({ description: '성별', example: '남' })
    @IsOptional()
    @IsString()
    gender: string;

    @ApiProperty({ description: '생년월일', example: '1990-01-01' })
    @IsOptional()
    @IsString()
    birth: string;

    @ApiProperty({ description: 'DI', example: 'DI' })
    @IsOptional()
    @IsString()
    di: string;

    @ApiProperty({ description: '권한', example: UserRole.User })
    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole;
}