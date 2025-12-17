import { ApiProperty } from "@nestjs/swagger";
import { IsEnum,Matches } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { UserGender } from "src/user/enum/user-gender.enum";

export class NiceSuccessDto {
    @ApiProperty({ description: 'NICE 인증 결과 휴대폰 번호', type: String, example: '01012345678', format: 'phone' })
    @IsRequiredString()
    @Matches(/^01[0-9]\d{7,8}$/, { message: '전화번호는 하이픈 없이 11자리 숫자여야 합니다.', always: true })
    phone: string;

    @ApiProperty({ description: 'NICE 인증 결과 이름', type: String, example: '홍길동' })
    @IsRequiredString()
    name: string;

    @ApiProperty({ description: 'NICE 인증 결과 생년월일', type: String, example: '19900101' })
    @IsRequiredString()
    @Matches(/^\d{8}$/, { message: '생년월일은 YYYYMMDD 형식(8자리 숫자)이어야 합니다.', always: true })
    birth: string;

    @ApiProperty({ description: 'NICE 인증 결과 성별', enum: UserGender, example: UserGender.Male })
    @IsEnum(UserGender)
    gender: UserGender;

    @ApiProperty({ description: 'NICE 인증 결과 세션 키', type: String, example: 'sessionKey' })
    @IsRequiredString()
    sessionKey: string;
}