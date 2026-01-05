import { ApiProperty } from "@nestjs/swagger";
import { UserOauth } from "../entities/user-oauth.entity";
import { UserOauthType } from "../enum/user-oauth-type.enum";

export class UserOauthDto {
    @ApiProperty({ description: '사용자 식별자' })
    userId: string;

    @ApiProperty({ enum: UserOauthType, description: 'OAuth 타입' })
    type: UserOauthType;

    @ApiProperty({ description: '이메일' })
    email: string;

    constructor(userOauth: UserOauth) {
        this.userId = userOauth.user.publicId;
        this.type = userOauth.type;
        this.email = userOauth.email;
    }
}