import { ApiProperty } from "@nestjs/swagger";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { CategoryType } from "src/tag/enum/category-type.enum";
import { StoreStatusType } from "../enum/store-status-type.enum";
import { User } from "src/user/entity/user.entity";

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
    eCommerceLicenseNumber: string;

    @ApiProperty({ description: '통신판매업 신고증 이미지 id', example: 1, type: Number })
    eCommerceLicenseImageId: number;

    @ApiProperty({ description: '사업자 은행명', example: '은행명' })
    bankName: string;

    @ApiProperty({ description: '사업자 계좌번호', example: '1234567890123' })
    accountNumber: string;

    @ApiProperty({ description: '사업자 예금주', example: '홍길동' })
    accountOwner: string;

    @ApiProperty({ description: '사업자 정산계좌 이미지 id', example: 1, type: Number })
    accountImageId: number;    
    
    @ApiProperty({ description: '가게 카테고리', example: [CategoryType.Food, CategoryType.Lifestyle, CategoryType.Fashion], enum: CategoryType, isArray: true })
    category: CategoryType[];

    @ApiProperty({ description: '메인태그', example: ['태그1', '태그2', '태그3'], isArray: true })
    mainTags: string[];

    @ApiProperty({ description: '서브태그', example: ['태그1', '태그2', '태그3'], isArray: true })
    subTags: string[];

    @ApiProperty({ description: '가게 배너 이미지 id', example: 1, type: Number })
    storeBannerImageId: number;

    @ApiProperty({ description: '가게 프로필 이미지 id', example: 1, type: Number })
    storeProfileImageId: number;

    @ApiProperty({ description: '판매 수수료 비율', example: 11, type: Number })
    saleChageRate: number;
    
    @ApiProperty({ description: '가게 상태', example: StoreStatusType.Active, enum: StoreStatusType })
    status: StoreStatusType = StoreStatusType.Active;

    @ApiProperty({ description: '가게 등록 사용자 id', example: 1, type: Number })
    userId: number;

    @ApiProperty({ description: '가게 노출 여부', example: true, type: Boolean })
    isVisible: boolean = false;

    constructor( storeLog: StoreRegisterLog, user: User, saleChageRate: number){
        this.name = storeLog.name;
        this.phone = storeLog.phone;
        this.email = storeLog.email;
        this.businessRegistrationNumber = storeLog.businessRegistrationNumber;
        this.ceoName = storeLog.ceoName;
        this.businessType = storeLog.businessType;
        this.businessCategory = storeLog.businessCategory;
        this.eCommerceLicenseNumber = storeLog.eCommerceLicenseNumber;
        this.eCommerceLicenseImageId = storeLog.eCommerceLicenseImageId;
        this.bankName = storeLog.bankName;
        this.accountNumber = storeLog.accountNumber;
        this.accountOwner = storeLog.accountOwner;
        this.accountImageId = storeLog.accountImageId;
        this.category = storeLog.category;
        this.mainTags = storeLog.mainTags;
        this.subTags = storeLog.subTags;
        this.storeBannerImageId = storeLog.storeBannerImageId;
        this.storeProfileImageId = storeLog.storeProfileImageId;
        this.saleChageRate = saleChageRate;
        this.status = StoreStatusType.Active;
        this.userId = user.id;
        this.isVisible = false;
    }
}