import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class StoreCreateDto {

    @ApiProperty({ description: '가게 이름', example: '가게 이름' })
    @IsRequiredString()
    name: string;

    @ApiProperty({ description: '가게 전화번호', example: '01012345678' })
    @IsRequiredString()
    phone: string;

    @ApiProperty({ description: '가게 이메일', example: 'test@test.com' })
    @IsRequiredString()
    email: string;

    @ApiProperty({ description: '사업자 등록번호', example: '1234567890123' })
    @IsRequiredString()
    businessRegistrationNumber: string;

    @ApiProperty({ description: '대표자 이름', example: '홍길동' })
    @IsRequiredString()
    ceoName: string;

    @ApiProperty({ description: '업태', example: '업태' })
    @IsRequiredString()
    businessType: string;

    @ApiProperty({ description: '업종', example: '업종' })
    @IsRequiredString()
    businessCategory: string;

    @ApiProperty({ description: '통신판매업 신고번호', example: '1234567890123' })
    @IsRequiredString()
    eCommerceLicenseNumber: string;

    // @ApiProperty({ description: '통신판매업 신고증 이미지' })
    // @IsRequiredString()
    // eCommerceLicenseImage: string;

    @ApiProperty({ description: '사업자 은행명', example: '은행명' })
    @IsRequiredString()
    bankName: string;
    
    @ApiProperty({ description: '사업자 계좌번호', example: '1234567890123' })
    @IsRequiredString()
    accountNumber: string;

    @ApiProperty({ description: '사업자 예금주', example: '홍길동' })
    @IsRequiredString()
    accountOwner: string;

    @ApiProperty({ description: '메인태그', example: '태그1,태그2,태그3' })
    @IsRequiredString()
    mainTag: string;

    @ApiProperty({ description: '서브태그', example: '태그1,태그2,태그3' })
    @IsRequiredString()
    subTag: string;

    // @ApiProperty({ type: 'string', format: 'binary', isArray: true })
    // files: any[];

    // @ApiProperty({ description: '사업자 등록증 이미지' })
    // businessRegistrationImage: Express.Multer.File;

    // @ApiProperty({ description: '통신판매업 신고증 이미지' })
    // @Exclude()
    // eCommerceLicenseImage: Express.Multer.File;

    // @ApiProperty({ description: '사업자 계좌번호 이미지' })
    // @Exclude()
    // accountImage: Express.Multer.File;

    // @ApiPropertyOptional({ description: '사업자 프로필 이미지' })
    // @Exclude()
    // @IsOptional()
    // profileImage?: Express.Multer.File;

    // @ApiPropertyOptional({ description: '사업자 배너 이미지' })
    // @Exclude()
    // @IsOptional()
    // bannerImage?: Express.Multer.File;

}
