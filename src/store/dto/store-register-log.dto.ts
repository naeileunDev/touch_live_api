import { ApiProperty } from "@nestjs/swagger";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { IsDate, IsEnum, IsNumber, ValidateNested } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { Type } from "class-transformer";
import { FileCommonDto } from "src/file/dto/file-common-dto";
import { TagCommonDto } from "src/tag/dto/tag-common.dto";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";
import { UserDto } from "src/user/dto";

export class StoreRegisterLogDto {
    @ApiProperty({ description: '가게 등록 로그 식별자', example: 1, type: Number })
    @IsNumber()
    id: number;

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

    @ApiProperty({ description: '사업자 등록증 이미지', example: 'https://example.com/businessRegistrationImage.jpg' })
    @IsNumber()
    businessRegistrationImageId: number;

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

    @ApiProperty({ description: '통신판매업 신고증 이미지', example: 'https://example.com/eCommerceLicenseImage.jpg' })
    @IsNumber()
    eCommerceLicenseImageId: number;

    @ApiProperty({ description: '사업자 은행명', example: '은행명' })
    @IsRequiredString()
    bankName: string;

    @ApiProperty({ description: '사업자 계좌번호', example: '1234567890123' })
    @IsRequiredString()
    accountNumber: string;

    @ApiProperty({ description: '사업자 예금주', example: '홍길동' })
    @IsRequiredString()
    accountOwner: string;

    @ApiProperty({ description: '사업자 정산계좌 이미지', example: 'https://example.com/accountImage.jpg' })
    @ValidateNested()
    @Type(() => FileCommonDto)
    accountImageId: number;


    @ApiProperty({ type: Number, isArray: true, description: '메인태그 리스트', example: [1, 2, 3] })
    @IsNumber({}, { each: true })
    mainTagIds: number[];

    @ApiProperty({ type: Number, isArray: true, description: '서브태그 리스트', example: [1, 2, 3] })
    @IsNumber({}, { each: true })
    subTagIds: number[];

    @ApiProperty({ description: '가게 등록 일시', example: '2025-01-01 12:00:00' })
    @IsDate()
    registerAt: Date;

    @ApiProperty({ description: '가게 등록 실패 일시', example: '2025-01-01 12:00:00' })
    @IsDate()
    registerFailedAt: Date;

    @ApiProperty({ description: '가게 등록 상태', example: 'PENDING' })
    @IsEnum(StoreRegisterStatus)
    status: StoreRegisterStatus;

    @ApiProperty({ description: '가게 프로필 이미지', example: 'https://example.com/storeProfileImage.jpg' })
    @IsNumber()
    storeProfileImageId: number;

    @ApiProperty({ description: '가게 배너 이미지', example: 'https://example.com/storeBannerImage.jpg' })
    @IsNumber()
    storeBannerImageId: number;

    @ApiProperty({ description: '가게 등록 사용자', example: {id: 1, name: '홍길동'} })
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;


    constructor(private readonly storeRegisterLog: StoreRegisterLog) {
        this.id = storeRegisterLog.id;
        this.name = storeRegisterLog.name;
        this.phone = storeRegisterLog.phone;
        this.email = storeRegisterLog.email;
        this.businessRegistrationNumber = storeRegisterLog.businessRegistrationNumber;
        this.businessRegistrationImageId = storeRegisterLog.businessRegistrationImageId;
        this.ceoName = storeRegisterLog.ceoName;
        this.businessType = storeRegisterLog.businessType;
        this.businessCategory = storeRegisterLog.businessCategory;
        this.eCommerceLicenseNumber = storeRegisterLog.eCommerceLicenseNumber;
        this.eCommerceLicenseImageId = storeRegisterLog.eCommerceLicenseImageId;
        this.bankName = storeRegisterLog.bankName;
        this.accountNumber = storeRegisterLog.accountNumber;
        this.accountOwner = storeRegisterLog.accountOwner;
        this.accountImageId = storeRegisterLog.accountImageId;
        this.registerAt = storeRegisterLog.registerAt ? new Date(storeRegisterLog.registerAt) : null;
        this.registerFailedAt = storeRegisterLog.registerFailedAt ? new Date(storeRegisterLog.registerFailedAt) : null;
        this.status = storeRegisterLog.status;
        this.storeProfileImageId = storeRegisterLog.storeProfileImageId;
        this.storeBannerImageId = storeRegisterLog.storeBannerImageId;
        this.mainTagIds = storeRegisterLog.mainTagIds;
        this.subTagIds = storeRegisterLog.subTagIds;
    }
}