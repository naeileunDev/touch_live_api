import { ApiProperty } from "@nestjs/swagger";

export class AuthTokenDto {
    @ApiProperty({ description: '액세스 토큰', type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJBRE1JTiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NjI3NDI4NDcsImV4cCI6MTc2Mjc0MzE0N30.2lUQIqXr6eTyGKTEhwuUiHmvw4FGEi1_HAB4JIMe1xI' })
    accessToken: string;

    @ApiProperty({ description: '리프레시 토큰', type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInJvbGUiOiJBRE1JTiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3NjI3NDI4NDcsImV4cCI6MTc2Mjc0MzE0N30.2lUQIqXr6eTyGKTEhwuUiHmvw4FGEi1_HAB4JIMe1xI' })
    refreshToken: string;

    constructor(accessToken: string, refreshToken?: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}