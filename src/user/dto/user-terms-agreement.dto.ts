import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class UserTermsAgreementDto {
    @ApiProperty({ description: '이용약관 동의', example: true })
    @IsBoolean({ message: '이용약관 동의는 true 값이어야 합니다.', always: true})
    reqService: boolean;

    @ApiProperty({ description: '위치기반 이용약관 동의', example: true })
    @IsBoolean({ message: '위치기반 이용약관 동의는 true 값이어야 합니다.', always: true})
    reqLocation: boolean;

    @ApiProperty({ description: '전자금융거래 이용동의', example: true })
    @IsBoolean({ message: '전자금융거래 이용동의는 true 값이어야 합니다.', always: true})
    reqFinance: boolean;

    // 선택 약관
    @ApiProperty({ description: '맞춤형 숏폼 콘텐츠 추천', example: false, required: false })
    @IsOptional()
    @IsBoolean({ message: '맞춤형 숏폼 콘텐츠 추천는 boolean 값이어야 합니다.'})
    optShortform?: boolean;

    @ApiProperty({ description: '마케팅 정보 수신 동의', example: false, required: false })
    @IsOptional()
    @IsBoolean({ message: '마케팅 정보 수신 동의는 boolean 값이어야 합니다.'})
    optMarketing?: boolean;

    @ApiProperty({ description: '개인정보 제3자 제공 동의', example: false, required: false })
    @IsOptional()
    @IsBoolean({ message: '개인정보 제3자 제공 동의는 boolean 값이어야 합니다.'})
    optThirdparty?: boolean;
}