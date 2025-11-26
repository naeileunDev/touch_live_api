import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { UserOauthType } from "src/user/enum/user-oauth-type.enum";

export class AuthSnsUnlinkDto {
    @ApiProperty({ description: 'SNS 유형', enum: UserOauthType })
    @IsNotEmpty()
    @IsEnum(UserOauthType)
    type: UserOauthType;
}