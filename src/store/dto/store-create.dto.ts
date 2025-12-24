import { ApiProperty } from "@nestjs/swagger";
import { plainToInstance, Transform, Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsDefined, IsEnum, IsInstance, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { TagCommonDto } from "src/tag/dto/tag-common.dto";
import { Tag } from "src/tag/entity/tag.entity";
import { CategoryType } from "src/tag/enum/category-type.enum";

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

    @ApiProperty({ description: '사업자 은행명', example: '은행명' })
    @IsRequiredString()
    bankName: string;
    
    @ApiProperty({ description: '사업자 계좌번호', example: '1234567890123' })
    @IsRequiredString()
    accountNumber: string;

    @ApiProperty({ description: '사업자 예금주', example: '홍길동' })
    @IsRequiredString()
    accountOwner: string;

    @ApiProperty({ type: TagCommonDto, isArray: true, description: '메인태그 리스트', example: [{id: 1, name: '태그1'}, {id: 2, name: '태그2'}, {id: 3, name: '태그3'}]})
    @Transform(({ value }) => {
        const rawArray = typeof value === 'string' ? JSON.parse(value) : value;
        return plainToInstance(TagCommonDto, rawArray);
      }) 
    @IsArray() 
    @Type(() => TagCommonDto)
    @ValidateNested({ each: true })
    mainTag: TagCommonDto[];

    @ApiProperty({ description: '서브태그 리스트', example: [{id: 1, name: '태그1'}, {id: 2, name: '태그2'}, {id: 3, name: '태그3'}], type: [TagCommonDto] })
    @Transform(({ value }) => {
        const rawArray = typeof value === 'string' ? JSON.parse(value) : value;
        return plainToInstance(TagCommonDto, rawArray);
      })
    @IsArray() 
    @Type(() => TagCommonDto)  // @IsArray() 다음에 위치
    @ValidateNested({ each: true })  //  @Type() 다음에 위치
    subTag: TagCommonDto[];

    @ApiProperty({ description: 'FCM 토큰', example: 'FCM_TOKEN' })
    @IsRequiredString()
    fcmToken: string;

    @ApiProperty({ description: '가게 카테고리', example: [CategoryType.Food, CategoryType.Lifestyle, CategoryType.Fashion], enum: CategoryType, isArray: true })
    @IsArray()
    @IsEnum(CategoryType, { each: true })
    @Transform(({ value }) => 
        typeof value === 'string' 
            ? value.split(',').map(v => v.trim() as CategoryType)
            : value
    )
    @MinLength(1)
    @MaxLength(3)
    category: CategoryType[];
}
