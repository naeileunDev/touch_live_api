import { ApiProperty } from "@nestjs/swagger";
import { AuthTokenDto } from "./auth-token.dto";
import { UserDto } from "src/user/dto/user.dto";
import { Type } from "class-transformer";

export class AuthLoginResponseDto {
    @ApiProperty({ description: '로그인한 유저 정보', type: UserDto })
    @Type(() => UserDto)
    user: UserDto;

    @ApiProperty({ description: '토큰 정보', type: AuthTokenDto })
    @Type(()=>AuthTokenDto)
    token: AuthTokenDto;

    constructor(user: UserDto, accessToken: string, refreshToken?: string) {
        this.user = user;
        this.token = new AuthTokenDto(accessToken, refreshToken);
    }
}