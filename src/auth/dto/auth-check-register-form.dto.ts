import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { TermLogCreateDto } from "src/term/dto/term-log-create.dto";
import { TermType } from "src/term/enum/term-version.enum";
import { UserCreateDto } from "src/user/dto/user-create.dto";
import { UserSignupSourceDto } from "src/user/dto/user-signup-source.dto";

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
        type: [TermLogCreateDto], // () => [TermLogCreateDto] 대신 배열 리터럴 사용
        example: [{ termType: TermType.LocationBased, isAgreed: true, termVersionId: 1, isRequired: true }],
        isArray: true,            // 리스트임을 명시적으로 선언
        required: true
    })
    @IsArray() // 배열인지 검증하는 데코레이터 추가 
    @ValidateNested({ each: true })
    @Type(() => TermLogCreateDto)
    termsAgreementInfo: TermLogCreateDto[];
}