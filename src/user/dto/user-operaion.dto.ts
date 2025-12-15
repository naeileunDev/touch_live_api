import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../enum/user-role.enum";
import { UserDto } from "./user.dto";
import { IsEnum, IsIn, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UserOperationDto {
    
    @ApiProperty({ description: '사용자 권한', enum: UserRole })
    @IsEnum(UserRole)
    @IsIn([UserRole.Admin, UserRole.Manager])
    role: UserRole;

    @ApiProperty({ description: '사용자', type: UserDto })
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;

    constructor(user: UserDto, role: UserRole) {
        this.user = user;
        this.role = role;
    }
}