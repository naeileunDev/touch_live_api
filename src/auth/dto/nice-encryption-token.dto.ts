import { ApiProperty } from "@nestjs/swagger";

export class NiceEncryptionTokenDto {
    @ApiProperty({ description: '암호화 데이터', type: String, example: '암호화된값' })
    encData: string;

    @ApiProperty({ description: '정보 전달 검증 값', type: String, example: 'integrity' })
    integrity: string;

    @ApiProperty({ description: '토큰 버전 ID', type: String, example: 'tokenVersionId' })
    tokenVersionId: string;
}