import { ApiProperty } from "@nestjs/swagger";
import { UserOauthType } from "../enum/user-oauth-type.enum";
import { UserDto } from "./user.dto";
import { UserRole } from "../enum/user-role.enum";
import { IsEnum, IsOptional } from "class-validator";

export class UserOauthCreateDto {
    @ApiProperty({ description: 'SNS 타입', enum: UserOauthType })
    type: UserOauthType;

    @ApiProperty({ description: 'SNS 사용자 ID' })
    snsUserId: string;

    @ApiProperty({ description: '이메일' })
    email: string;

    @ApiProperty({ description: '사용자' })
    user: UserDto;

    @ApiProperty({ description: '사용자 권한', enum: UserRole, default: UserRole.User })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.User;
}