import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthSnsLoginDto {
    @ApiProperty({ description: 'SNS 세션 키', example: "string" })
    @IsNotEmpty()
    @IsString()
    sessionKey: string;

    @ApiProperty({ description: 'FCM 토큰', example: "string"})
    @IsNotEmpty()
    @IsString()
    fcmToken: string;
}