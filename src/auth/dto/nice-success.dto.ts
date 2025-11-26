import { ApiProperty } from "@nestjs/swagger";

export class NiceSuccessDto {
    @ApiProperty({ description: 'NICE 인증 결과 휴대폰 번호' })
    phone: string;

    @ApiProperty({ description: 'NICE 인증 결과 이름' })
    name: string;

    @ApiProperty({ description: 'NICE 인증 결과 생년월일' })
    birth: string;

    @ApiProperty({ description: 'NICE 인증 결과 성별' })
    gender: string;

    @ApiProperty({ description: 'NICE 인증 결과 세션 키' })
    sessionKey: string;
}