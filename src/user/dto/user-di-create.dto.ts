import { ApiProperty } from "@nestjs/swagger";

export class UserDiCreateDto {
    @ApiProperty({ description: 'di' })
    di: string;

    @ApiProperty({ description: '사용자 공개 식별자' })
    publicId: string;
}