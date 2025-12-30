import { ApiProperty } from "@nestjs/swagger";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { IsArray, IsDate, IsEnum, IsNumber, ValidateNested } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { StoreRegisterStatus } from "../enum/store-register-status.enum";
import { CategoryType } from "src/tag/enum/category-type.enum";
import { UserRole } from "src/user/enum/user-role.enum";
import { Type } from "class-transformer";
import { TagCommonDto } from "src/tag/dto/tag-common.dto";

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

    @ApiProperty({ description: '사업자 은행명', example: '은행명' })
    @IsRequiredString()
    bankName: string;

    @ApiProperty({ description: '사업자 계좌번호', example: '1234567890123' })
    @IsRequiredString()
    accountNumber: string;

    @ApiProperty({ description: '사업자 예금주', example: '홍길동' })
    @IsRequiredString()
    accountOwner: string;

    @ApiProperty({ description: '사업자 정산계좌 이미지', example: '459' })
    @IsNumber()
    accountImageId: number;


    @ApiProperty({ type: TagCommonDto, isArray: true, description: '메인태그 리스트', example: [{id: 1, name: '태그1'}, {id: 2, name: '태그2'}, {id: 3, name: '태그3'}] })
    @IsArray() 
    @Type(() => TagCommonDto)
    @ValidateNested({ each: true })
    mainTag: TagCommonDto[];

    @ApiProperty({ type: TagCommonDto, isArray: true, description: '서브태그 리스트', example: [{id: 1, name: '태그1'}, {id: 2, name: '태그2'}, {id: 3, name: '태그3'}] })
    @IsArray() 
    @Type(() => TagCommonDto)
    @ValidateNested({ each: true })
    subTag: TagCommonDto[];

    @ApiProperty({ description: '가게 등록 상태', example: 'PENDING' })
    @IsEnum(StoreRegisterStatus)
    status: StoreRegisterStatus;

    @ApiProperty({ description: '가게 등록 사용자', example: {id: 'uuid', role: UserRole.User} })
    user: {
        id: string;
        role: UserRole;
    };

    @ApiProperty({ description: '가게 카테고리', example: [CategoryType.Food, CategoryType.Lifestyle, CategoryType.Fashion], enum: CategoryType, isArray: true })
    category: CategoryType[];

    constructor(storeRegisterLog: StoreRegisterLog, mainTag: TagCommonDto[], subTag: TagCommonDto[]) {
        this.id = storeRegisterLog.id;
        this.name = storeRegisterLog.name;
        this.phone = storeRegisterLog.phone;
        this.email = storeRegisterLog.email;
        this.businessRegistrationNumber = storeRegisterLog.businessRegistrationNumber;
        this.ceoName = storeRegisterLog.ceoName;
        this.businessType = storeRegisterLog.businessType;
        this.businessCategory = storeRegisterLog.businessCategory;
        this.eCommerceLicenseNumber = storeRegisterLog.eCommerceLicenseNumber;
        this.bankName = storeRegisterLog.bankName;
        this.accountNumber = storeRegisterLog.accountNumber;
        this.accountOwner = storeRegisterLog.accountOwner;
        this.accountImageId = storeRegisterLog.accountImageId;
        this.category = storeRegisterLog.category;
        this.status = storeRegisterLog.status;
        this.mainTag = mainTag;
        this.subTag = subTag;
        this.user = {
            id: storeRegisterLog.user.publicId,
            role: storeRegisterLog.user.role as UserRole,
        };
    }
    
}