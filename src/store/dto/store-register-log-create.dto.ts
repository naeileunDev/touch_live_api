import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { FileDto } from "src/file/dto/file.dto";
import { StoreRegisterLogFilesDto } from "src/file/dto/store-register-log-files.dto";
import { CategoryType } from "src/tag/enum/category-type.enum";

export class StoreRegisterLogCreateDto {

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

    @ApiProperty({ type: 'string', isArray: true, description: '메인태그 리스트', example: ['태그1', '태그2', '태그3']})
    @IsArray() 
    @IsString({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            if (value.includes(',')) {
                return value.split(',').map(v => v.trim()).filter(v => v);
            }
            // 단일 문자열인 경우 배열로 변환
            return [value.trim()].filter(v => v);
        }
        return value;
    })
    mainTags: string[];

    @ApiProperty({ type: 'string', isArray: true, description: '서브태그 리스트', example: ['태그1', '태그2', '태그3']})
    @IsArray() 
    @IsString({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @Transform(({ value }) => {
        if (!value) return undefined;
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            // 쉼표로 구분된 문자열인 경우
            if (value.includes(',')) {
                return value.split(',').map(v => v.trim()).filter(v => v);
            }
            return [value.trim()].filter(v => v);
        }
        return value;
    })
    subTags: string[];

    @ApiProperty({ description: 'FCM 토큰', example: 'FCM_TOKEN' })
    @IsRequiredString()
    fcmToken: string;

    @ApiProperty({ description: '가게 카테고리', example: [CategoryType.Food, CategoryType.Lifestyle, CategoryType.Fashion], enum: CategoryType, isArray: true })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @IsEnum(CategoryType, { each: true })
    @Transform(({ value }) => 
        typeof value === 'string' 
            ? value.split(',').map(v => v.trim() as CategoryType)
            : value
    )
    category: CategoryType[];

    @ApiProperty({ description: '가게 정보', example: '가게 정보' })
    @IsRequiredString()
    @IsString()
    @MaxLength(255)
    storeInfo: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => StoreRegisterLogFilesDto)
    files: StoreRegisterLogFilesDto;

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

    constructor(createDto: StoreRegisterLogCreateDto, files: StoreRegisterLogFilesDto) {
        Object.assign(this, createDto);
        this.files = files;
    }
}