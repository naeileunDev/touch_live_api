import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { UserGender } from "../enum/user-gender.enum";
import { UserRole } from "../enum/user-role.enum";
import { IsLoginId } from "src/common/validator/is-login-id";
import { IsPassword } from "src/common/validator/is-password";
import { IsNickname } from "src/common/validator/is-nickname";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class UserCreateDto {
    @ApiProperty({ description: '로그인 아이디', example: 'user123' })
    @IsLoginId()
    loginId: string;
    
    @ApiProperty({ description: '비밀번호', example: 'Password1!' })
    @IsPassword()
    password: string;

    @ApiProperty({ description: '닉네임', example: '홍길동' })
    @IsNickname()
    nickname: string;
    
    @ApiProperty({ description: '나이스 인증 세션키', example: 'test' })
    @IsRequiredString()
    sessionKey: string;

    @ApiPropertyOptional({ description: 'FCM 토큰', example: '토큰' })
    @IsOptional()
    @IsRequiredString()
    fcmToken?: string;

    @ApiProperty({ description: '이메일', example: 'user123@example.com' })
    @IsRequiredString()
    email: string;

    @ApiProperty({ description: '이름', example: 'John Doe' })
    @IsRequiredString()
    name: string;

    @ApiProperty({ description: '전화번호', example: '01012345678', format: 'phone' })
    @IsRequiredString()
    @Matches(/^01[0-9]\d{7,8}$/, { message: '전화번호는 하이픈 없이 11자리 숫자여야 합니다.' })
    phone: string;

    @ApiProperty({ description: '성별', example: UserGender.Male, enum: UserGender })
    @IsEnum(UserGender)
    gender: UserGender;

    @ApiProperty({ description: '생년월일', example: '19900101' })
    @IsRequiredString()
    @Matches(/^\d{8}$/, { message: '생년월일은 YYYYMMDD 형식(8자리 숫자)이어야 합니다.' })
    birth: string;

    @ApiProperty({ description: 'DI', example: 'DI' })
    @IsRequiredString()
    di: string;

    @ApiProperty({ description: 'CI', example: 'CI' })
    @IsRequiredString()
    ci: string;
}
