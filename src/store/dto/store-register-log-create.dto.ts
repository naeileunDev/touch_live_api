import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { plainToInstance, Transform } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
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

    @ApiPropertyOptional({ description: '가게 정보', example: '가게 정보', nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    storeInfo: string;
}
