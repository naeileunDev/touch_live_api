import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthFindIdDto {
    @ApiProperty({ description: 'NICE 세션 키' })
    @IsNotEmpty()
    @IsString()
    sessionKey: string;
}