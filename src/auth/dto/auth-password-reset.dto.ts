import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthPasswordResetDto {
    @ApiProperty({ description: 'NICE 세션 키' })
    @IsNotEmpty()
    @IsString()
    sessionKey: string;

    @ApiProperty({ description: '새 비밀번호' })
    @IsNotEmpty()
    @IsString()
    password: string;
}