import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { UserCreateDto } from "src/user/dto/user-create.dto";
import { UserSignupSourceDto } from "src/user/dto/user-signup-source.dto";

export class AuthCheckRegisterFormDto {
    @ApiProperty({ 
        description: '회원가입에 필요한 데이터', 
        type: () => UserCreateDto,
        required: true
    })
    @Type(() => UserCreateDto)
    userInfo: UserCreateDto;
    @ApiProperty({ 
        description: '유입경로 정보', 
        type: () => UserSignupSourceDto,
        required: true
    })
    @Type(() => UserSignupSourceDto)
    signupSourceInfo: UserSignupSourceDto;
}