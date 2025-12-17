import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../enum/user-role.enum";
import { IsEnum, IsIn } from "class-validator";
import { IsLoginId } from "src/common/validator/is-login-id";

export class UserOperationRequestDto {
    @ApiProperty({ description: '사용자 로그인 아이디', example: 'test' })
    @IsLoginId()
    loginId: string;

    @ApiProperty({ description: '사용자 권한', example: UserRole.Manager })
    @IsEnum(UserRole)
    @IsIn([UserRole.Manager, UserRole.Admin])
    role: UserRole;
}