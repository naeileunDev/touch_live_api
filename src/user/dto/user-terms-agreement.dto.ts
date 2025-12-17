import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsOptional } from "class-validator";

export class UserTermsAgreementDto {
    @ApiProperty({ description: '서비스 이용약관 동의', example: true })
    @IsBoolean({ message: '서비스 이용약관 동의는 boolean 값이어야 합니다.'})
    @IsIn([true], { message: '서비스 이용약관 동의는 필수입니다. (true 값만 허용됩니다.)' })
    reqService: boolean;

    @ApiProperty({ description: '위치기반 이용약관 동의', example: true })
    @IsBoolean({ message: '위치기반 이용약관 동의는 boolean 값이어야 합니다.'})
    @IsIn([true], { message: '위치기반 이용약관 동의는 필수입니다. (true 값만 허용됩니다.)'})
    reqLocation: boolean;

    @ApiProperty({ description: '전자금융거래 이용동의', example: true })
    @IsBoolean({ message: '전자금융거래 이용동의는 boolean 값이어야 합니다.'})
    @IsIn([true], { message: '전자금융거래 이용동의는 필수입니다. (true 값만 허용됩니다.)'})
    reqFinance: boolean;

    // 선택 약관
    @ApiProperty({ description: '맞춤형 숏폼 콘텐츠 추천', example: false })
    @IsBoolean({ message: '맞춤형 숏폼 콘텐츠 추천는 boolean 값이어야 합니다.'})
    optShortform: boolean;

    @ApiProperty({ description: '마케팅 정보 수신 동의', example: false })
    @IsBoolean({ message: '마케팅 정보 수신 동의는 boolean 값이어야 합니다.'})
    optMarketing: boolean;

    @ApiProperty({ description: '개인정보 제3자 제공 동의', example: false })
    @IsBoolean({ message: '개인정보 제3자 제공 동의는 boolean 값이어야 합니다.'})
    optThirdparty: boolean;
}