import { ApiProperty } from "@nestjs/swagger";
import { UserOauthType } from "src/user/enum/user-oauth-type.enum";

export class AuthSnsProfileDto {
    @ApiProperty({ description: 'OAuth 인증 코드' })
    snsUserId: string;

    @ApiProperty({ description: '이메일' })
    email: string;

    @ApiProperty({ description: 'OAuth 타입' })
    type: UserOauthType;
}