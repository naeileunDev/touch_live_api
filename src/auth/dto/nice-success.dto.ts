import { ApiProperty } from "@nestjs/swagger";

export class NiceSuccessDto {
    @ApiProperty({ description: 'NICE 인증 결과 휴대폰 번호', type: String, example: '01012345678' })
    phone: string;

    @ApiProperty({ description: 'NICE 인증 결과 이름', type: String, example: '홍길동' })
    name: string;

    @ApiProperty({ description: 'NICE 인증 결과 생년월일', type: String, example: '1990-01-01' })
    birth: string;

    @ApiProperty({ description: 'NICE 인증 결과 성별', type: String, example: '남' })
    gender: string;

    @ApiProperty({ description: 'NICE 인증 결과 세션 키', type: String, example: 'sessionKey' })
    sessionKey: string;
}