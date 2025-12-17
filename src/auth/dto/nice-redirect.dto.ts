import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class NiceRedirectDto {
    @ApiProperty({ description: 'NICE 인증 결과 토큰 버전 ID', type: String, example: 'token_version_id' })
    @IsNotEmpty()
    @IsString()
    token_version_id: string;

    @ApiProperty({ description: 'NICE 인증 결과 암호화 데이터', type: String, example: 'enc_data' })
    @IsNotEmpty()
    @IsString()
    enc_data: string;

    @ApiProperty({ description: 'NICE 인증 결과 정수값', type: String, example: 'integrity_value' })
    @IsNotEmpty()
    @IsString()
    integrity_value: string;
}