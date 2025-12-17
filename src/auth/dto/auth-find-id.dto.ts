import { ApiProperty } from "@nestjs/swagger";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class AuthFindIdDto {
    @ApiProperty({ description: 'NICE 세션 키', example: 'test' })
    @IsRequiredString()
    sessionKey: string;
}