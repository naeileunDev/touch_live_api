import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Exclude, Type } from "class-transformer";
import { UploadType } from "src/common/enums";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { ProductTargetGender } from "../enum/product-target-gender.enum";
import { ProductTargetAge } from "../enum/product-target-age.enum";
import { ProductOptionDetailCreateDto } from "./product-option-detail-create.dto";
import { ProductFilesDto } from "./prodcut-files.dto";
import { FileDto } from "src/file/dto/file.dto";

export class ProductCreateDto {

    @ApiProperty({ description: '등록 비용', type: Number, example: 0 })
    @IsOptional()
    @IsNumber()
    registerFee?: number;

    @ApiProperty({ description: '업로드 타입', enum: UploadType, example: UploadType.Normal })
    @IsEnum(UploadType)
    uploadType: UploadType = UploadType.Normal;

    @ApiProperty({ description: '조합 옵션 여부', type: Boolean, example: true })
    @IsBoolean()
    isMixed: boolean;

    @ApiPropertyOptional({ description: '재고(단일 옵션시)', type: Number, nullable: true })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiProperty({ description: '상품명', example: '상품명' })
    @IsRequiredString()
    name: string;

    @ApiProperty({ description: '가격', type: Number, example: 10000 })
    @IsNumber()
    price: number;

    @ApiProperty({ description: '구매 대상 성별', enum: ProductTargetGender, example: ProductTargetGender.Male })
    @IsEnum(ProductTargetGender)
    targetGender: ProductTargetGender;

    @ApiProperty({ description: '구매 대상 나이', enum: ProductTargetAge, example: ProductTargetAge.Adult })
    @IsEnum(ProductTargetAge)
    targetAge: ProductTargetAge;

    @ApiPropertyOptional({ description: '할인 가격', type: Number, example: 1000 })
    @IsOptional()
    @IsNumber()
    discountValue?: number;

    @ApiProperty({ description: '배송비', type: Number, example: 1000 })
    @IsNumber()
    deliveryFee: number;

    @ApiProperty({ description: '배송 회사', example: '배송 회사' })
    @IsRequiredString()
    deliveryCompany: string;

    @ApiProperty({ description: '배송 기간', example: '3일 ~ 4일 소요'})
    @IsRequiredString()
    deliveryPeriod: string;

    @ApiProperty({ description: '제주도 배송비', type: Number, example: 0 })
    @IsNumber()
    jejuDeliveryFee: number;

    @ApiProperty({ description: '도서산간 배송비', type: Number, example: 0 })
    @IsNumber()
    islandDeliveryFee: number;

    @ApiProperty({ description: '수수료', type: Number, example: 1000 })
    @IsNumber()
    charge: number;

    @ApiProperty({ description: '해당 상품 고시 정보', example: '해당 상품 고시 정보' })
    @IsRequiredString()
    reqInfo: string;

    @ApiProperty({ description: '해시 태그(최소 1개, 최대 3개까지)', example: ['해시 태그1', '해시 태그2', '해시 태그3'] })
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty({ description: '옵션 상세', type: ProductOptionDetailCreateDto, isArray: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOptionDetailCreateDto)
    options: ProductOptionDetailCreateDto[];

    @ApiProperty({ description: '파일', type: FileDto, isArray: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    fileDtos: FileDto[];
    
    @ApiPropertyOptional({ description: '파일', type: ProductFilesDto, nullable: true })
    @IsOptional()
    @Type(() => ProductFilesDto)
    files?: ProductFilesDto;
}