import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthFindIdDto {
    @ApiProperty({ description: 'NICE 세션 키', example: 'test' })
    @IsString({ always: true })
    sessionKey: string;
}