import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { StoreStatusType } from "../enum/store-status-type.enum";
import { CategoryType } from "src/tag/enum/category-type.enum";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";

export class StoreDto {
    @ApiProperty({ description: '가게 식별자', example: 1, type: Number })
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

    @ApiProperty({ description: '가게 상태', example: StoreStatusType.Active, enum: StoreStatusType })
    @IsEnum(StoreStatusType)
    status: StoreStatusType;

    @ApiProperty({ description: '사업자 등록번호', example: '1234567890123' })
    @IsRequiredString()
    businessRegistrationNumber: string;

    @ApiProperty({ description: '사업자 등록증 이미지 id', example: 1, type: Number })
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

    @ApiProperty({ description: '통신판매업 신고증 이미지 id', example: 1, type: Number })
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

    @ApiProperty({ description: '사업자 정산계좌 이미지 id', example: 1, type: Number })
    @IsNumber()
    accountImageId: number;
    
    @ApiProperty({ description: '가게 카테고리', example: [CategoryType.Food, CategoryType.Lifestyle, CategoryType.Fashion], enum: CategoryType, isArray: true })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @IsEnum(CategoryType, { each: true })
    category: CategoryType[];

    @ApiProperty({ description: '가게 등록 비용', example: 11, type: Number })
    @IsNumber()
    storeEntryFee: number;
    
    @ApiProperty({ description: '가게 등록 사용자 id', example: 1, type: Number })
    @IsNumber()
    userId: number;

    @ApiProperty({ description: '가게 정보', example: '가게 정보' })
    @IsRequiredString()
    storeInfo: string;

    @ApiPropertyOptional({ description: '가게 배너 이미지 id', example: 1, type: Number })
    @IsOptional()
    @IsNumber()
    storeBannerImageId?: number | null;

    @ApiPropertyOptional({ description: '가게 프로필 이미지 id', example: 1, type: Number })
    @IsOptional()
    @IsNumber()
    storeProfileImageId?: number | null;

    @ApiProperty({ description: '가게 메인 태그', example: ['태그1', '태그2', '태그3'], isArray: true })
    @IsArray()
    @IsString({ each: true })
    @MinLength(1)
    @MaxLength(3)
    mainTags: string[];

    @ApiProperty({ description: '가게 서브 태그', example: ['태그1', '태그2', '태그3'], isArray: true })
    @IsArray()
    @IsString({ each: true })
    @MinLength(1)
    @MaxLength(5)
    subTags: string[];

    @ApiProperty({ description: '가게 노출 여부', example: true, type: Boolean })
    @IsBoolean()
    isVisible: boolean;
    
    @ApiProperty({ description: '교환/환불 불가 사유', example: '교환/환불 불가 사유' })
    @IsRequiredString()
    nonReturnableReason: string;

    @ApiProperty({ description: '교환/환불 처리 방법', example: '교환/환불 처리 방법' })
    @IsRequiredString()
    returnableProcess: string;

    @ApiProperty({ description: '택배 지불 주체', example: '택배 지불 주체' })
    @IsRequiredString()
    shippingPayer: string;

    @ApiProperty({ description: 'As 제공자', example: 'As 제공자' })
    @IsRequiredString()
    asProvider: string;

    @ApiProperty({ description: '고객센터 전화번호', example: '고객센터 전화번호' })
    @IsRequiredString()
    csPhoneNumber: string;

    constructor(storeRegisterLog: StoreRegisterLog, fee: number) {
       Object.assign(this, storeRegisterLog);
       this.storeEntryFee = fee;
    }

}