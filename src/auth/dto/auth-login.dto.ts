import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthLoginDto {
    @ApiProperty({ description: '아이디', example: "string" })
    @IsNotEmpty()
    @IsString()
    loginId: string;

    @ApiProperty({ description: '비밀번호', example: "string" })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ description: 'FCM 토큰', example: "string" })
    @IsNotEmpty()
    @IsString()
    fcmToken: string;
}