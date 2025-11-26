import { ApiProperty } from "@nestjs/swagger";
import { UserOauthDto } from "src/user/dto/user-oauth.dto";

export class AuthFindIdResponseDto {
    @ApiProperty({ description: '사용자 로그인 아이디' })
    loginId: string = null;

    @ApiProperty({ description: 'SNS 정보 목록' })
    snsInfos: UserOauthDto[] = [];
}