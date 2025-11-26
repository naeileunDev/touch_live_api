import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthSnsLinkDto {
    @ApiProperty({ description: '세션 키' })
    @IsNotEmpty()
    @IsString()
    sessionKey: string;
}