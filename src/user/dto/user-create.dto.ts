import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { UserGender } from "../enum/user-gender.enum";
import { UserRole } from "../enum/user-role.enum";
import { IsLoginId } from "src/common/validator/is-login-id";
import { IsPassword } from "src/common/validator/is-password";
import { IsNickname } from "src/common/validator/is_nickname";

export class UserCreateDto {
    @ApiProperty({ description: '로그인 아이디', example: 'user123' })
    @IsString({ always: true })
    @IsLoginId()
    loginId: string;
    
    @ApiProperty({ description: '비밀번호', example: 'Password1!' })
    @IsString({ always: true })
    @IsPassword()
    password: string;

    @ApiProperty({ description: '닉네임', example: '홍길동' })
    @IsString({ always: true })
    @IsNickname()
    nickname: string;
    
    @ApiProperty({ description: '나이스 인증 세션키', example: 'test' })
    @IsString({ always: true })
    sessionKey: string;

    @ApiProperty({ description: 'FCM 토큰', example: '토큰' })
    @IsOptional()
    @IsString()
    fcmToken: string;

    @ApiProperty({ description: '이메일', example: 'user123@example.com' })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ description: '이름', example: 'John Doe' })
    @IsString({ always: true })
    name: string;

    @ApiProperty({ description: '전화번호', example: '01012345678', format: 'phone' })
    @IsString({ always: true })
    @Matches(/^01[0-9]\d{7,8}$/, { message: '전화번호는 하이픈 없이 11자리 숫자여야 합니다.', always: true })
    phone: string;

    @ApiProperty({ description: '성별', example: UserGender.Male, enum: UserGender })
    @IsEnum(UserGender, { always: true })
    gender: UserGender;

    @ApiProperty({ description: '생년월일', example: '19900101' })
    @IsString({ always: true })
    @Matches(/^\d{8}$/, { message: '생년월일은 YYYYMMDD 형식(8자리 숫자)이어야 합니다.', always: true })
    birth: string;

    @ApiProperty({ description: 'DI', example: 'DI' })
    @IsString({ always: true })
    di: string;

    @ApiProperty({ 
        description: '권한', 
        enum: UserRole, 
        default: UserRole.User,
        required: false 
    })
    @IsOptional() 
    @IsEnum(UserRole)
    role?: UserRole;
    
}
