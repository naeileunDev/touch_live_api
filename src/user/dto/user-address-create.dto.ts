import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class UserAddressCreateDto {
    @ApiProperty({ description: '주소', example: '서울특별시 종로구 통일로 123' })
    @IsRequiredString()
    basicAddress: string;
    @ApiProperty({ description: '상세주소', example: '101동 101호'})
    @IsRequiredString()
    detailAddress: string;
    @ApiProperty({ description: '우편번호', example: '12345'})
    @IsRequiredString()
    zipCode: string;
    @ApiProperty({ description: '전화번호', example: '01012345678' })
    @IsRequiredString()
    phone: string;
    @ApiProperty({ description: '이름', example: '홍길동' })
    @IsRequiredString()
    name: string;
    @ApiPropertyOptional({ description: '주소 별명', example: '홍길동 집' })
    @IsOptional()
    @IsRequiredString()
    addressAlias?: string;
}