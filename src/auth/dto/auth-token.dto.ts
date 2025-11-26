import { ApiProperty } from "@nestjs/swagger";

export class AuthTokenDto {
    @ApiProperty({ description: '액세스 토큰' })
    accessToken: string;

    @ApiProperty({ description: '리프레시 토큰' })
    refreshToken: string;

    constructor(accessToken: string, refreshToken?: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}