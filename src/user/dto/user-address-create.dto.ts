import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UserAddressCreateDto {
    @ApiProperty({ description: '주소', example: '서울특별시 종로구 통일로 123', required: true })
    @IsString({ always: true })
    basicAddress: string;
    @ApiProperty({ description: '상세주소', example: '101동 101호', required: true })
    @IsString({ always: true })
    detailAddress: string;
    @ApiProperty({ description: '우편번호', example: '12345', required: true })
    @IsString({ always: true })
    zipCode: string;
    @ApiProperty({ description: '전화번호', example: '01012345678', required: true })
    @IsString({ always: true })
    phone: string;
    @ApiProperty({ description: '이름', example: '홍길동', required: true })
    @IsString({ always: true })
    name: string;
    @ApiProperty({ description: '주소 별명', example: '홍길동 집', required: false })
    @IsString({ always: true })
    @IsOptional()
    addressAlias?: string;
}