import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { UserCreateDto } from "src/user/dto/user-create.dto";
import { UserSignupSourceDto } from "src/user/dto/user-signup-source.dto";
import { UserTermsAgreementDto } from "src/user/dto/user-terms-agreement.dto";

export class AuthCheckRegisterFormDto {
    @ApiProperty({ 
        description: '회원가입에 필요한 데이터', 
        type: () => UserCreateDto,
        required: true
    })
    @ValidateNested()
    @Type(() => UserCreateDto)
    userInfo: UserCreateDto;
    @ApiProperty({ 
        description: '유입경로 정보', 
        type: () => UserSignupSourceDto,
        required: true
    })
    @ValidateNested()
    @Type(() => UserSignupSourceDto)
    signupSourceInfo: UserSignupSourceDto

    @ApiProperty({ 
        description: '약관 동의 정보', 
        type: () => UserTermsAgreementDto,
        required: true
    })
    @ValidateNested()
    @Type(() => UserTermsAgreementDto)
    termsAgreementInfo: UserTermsAgreementDto;;
}