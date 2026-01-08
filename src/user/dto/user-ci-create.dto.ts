import { ApiProperty } from "@nestjs/swagger";

export class UserCiCreateDto {
    @ApiProperty({ description: 'ci' })
    ci: string;

    @ApiProperty({ description: '사용자 공개 식별자' })
    publicId: string;
}