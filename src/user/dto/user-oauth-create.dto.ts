import { ApiProperty } from "@nestjs/swagger";
import { UserOauthType } from "../enum/user-oauth-type.enum";
import { UserDto } from "./user.dto";

export class UserOauthCreateDto {
    @ApiProperty({ description: 'SNS 타입', enum: UserOauthType })
    type: UserOauthType;

    @ApiProperty({ description: 'SNS 사용자 ID' })
    snsUserId: string;

    @ApiProperty({ description: '이메일' })
    email: string;

    @ApiProperty({ description: '사용자' })
    user: UserDto;
}