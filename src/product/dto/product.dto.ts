import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductCategory, GenderType, AgeType, ProductOptionType, UploadType, ProductItemType } from 'src/common/enums';

export class CreateProductOptionDto {
    @ApiPropertyOptional({ description: '옵션 이미지 파일 ID' })
    @IsOptional()
    @IsInt()
    imageFileId?: number;

    @ApiProperty({ description: '옵션명 (예: 블랙 / M)' })
    @IsString()
    @MaxLength(200)
    name: string;

    @ApiProperty({ description: '재고 수량' })
    @IsInt()
    @Min(0)
    stock: number;

    @ApiPropertyOptional({ description: '추가 가격', default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    additionalPrice?: number;
}

export class CreateProductRequiredInfoDto {
    @ApiProperty({ description: '품목 타입', enum: ProductItemType })
    @IsEnum(ProductItemType)
    itemType: ProductItemType;

    @ApiProperty({ description: '표기 정보명' })
    @IsString()
    @MaxLength(100)
    infoName: string;

    @ApiProperty({ description: '표기 정보 내용' })
    @IsString()
    @MaxLength(500)
    infoValue: string;
}

export class CreateProductDto {
    @ApiProperty({ description: '썸네일 파일 ID' })
    @IsInt()
    thumbnailFileId: number;

    @ApiProperty({ description: '상세 이미지 파일 ID 배열 (최대 10개)' })
    @IsArray()
    @IsInt({ each: true })
    detailImageFileIds: number[];

    @ApiProperty({ description: '제품명' })
    @IsString()
    @MaxLength(200)
    name: string;

    @ApiProperty({ description: '카테고리', enum: ProductCategory })
    @IsEnum(ProductCategory)
    category: ProductCategory;

    @ApiProperty({ description: '해시태그 ID 배열 (1~3개)' })
    @IsArray()
    @IsInt({ each: true })
    tagIds: number[];

    @ApiProperty({ description: '제품 가격' })
    @IsInt()
    @Min(0)
    price: number;

    @ApiPropertyOptional({ description: '할인율 (%)', default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    discountRate?: number;

    @ApiProperty({ description: '옵션 타입', enum: ProductOptionType })
    @IsEnum(ProductOptionType)
    optionType: ProductOptionType;

    @ApiPropertyOptional({ description: '재고 (단일 옵션일 때)' })
    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;

    @ApiPropertyOptional({ description: '옵션 목록 (옵션 타입일 때)' })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductOptionDto)
    options?: CreateProductOptionDto[];

    @ApiPropertyOptional({ description: '성별', enum: GenderType, default: GenderType.Unisex })
    @IsOptional()
    @IsEnum(GenderType)
    gender?: GenderType;

    @ApiPropertyOptional({ description: '연령', enum: AgeType, default: AgeType.All })
    @IsOptional()
    @IsEnum(AgeType)
    age?: AgeType;

    @ApiProperty({ description: '필수 표기 정보 목록' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductRequiredInfoDto)
    requiredInfos: CreateProductRequiredInfoDto[];

    @ApiPropertyOptional({ description: '상세 정보 이미지 파일 ID 배열' })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    infoImageFileIds?: number[];

    @ApiPropertyOptional({ description: '기본 배송비', default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    deliveryFee?: number;

    @ApiPropertyOptional({ description: '제주도 배송비', default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    jejuDeliveryFee?: number;

    @ApiPropertyOptional({ description: '도서산간 배송비', default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    islandDeliveryFee?: number;

    @ApiPropertyOptional({ description: '택배사' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    deliveryCompany?: string;

    @ApiPropertyOptional({ description: '배송 기간' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    deliveryPeriod?: string;

    @ApiProperty({ description: '업로드 타입', enum: UploadType })
    @IsEnum(UploadType)
    uploadType: UploadType;
}

export class UpdateProductDto {
    @ApiPropertyOptional({ description: '썸네일 파일 ID' })
    @IsOptional()
    @IsInt()
    thumbnailFileId?: number;

    @ApiPropertyOptional({ description: '제품명' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    name?: string;

    @ApiPropertyOptional({ description: '제품 가격' })
    @IsOptional()
    @IsInt()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ description: '할인율 (%)' })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    discountRate?: number;

    @ApiPropertyOptional({ description: '재고 (단일 옵션일 때)' })
    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;

    @ApiPropertyOptional({ description: '기본 배송비' })
    @IsOptional()
    @IsInt()
    @Min(0)
    deliveryFee?: number;

    @ApiPropertyOptional({ description: '제주도 배송비' })
    @IsOptional()
    @IsInt()
    @Min(0)
    jejuDeliveryFee?: number;

    @ApiPropertyOptional({ description: '도서산간 배송비' })
    @IsOptional()
    @IsInt()
    @Min(0)
    islandDeliveryFee?: number;
}

export class ProductListQueryDto {
    @ApiPropertyOptional({ description: '카테고리', enum: ProductCategory })
    @IsOptional()
    @IsEnum(ProductCategory)
    category?: ProductCategory;

    @ApiPropertyOptional({ description: '성별', enum: GenderType })
    @IsOptional()
    @IsEnum(GenderType)
    gender?: GenderType;

    @ApiPropertyOptional({ description: '연령', enum: AgeType })
    @IsOptional()
    @IsEnum(AgeType)
    age?: AgeType;

    @ApiPropertyOptional({ description: '스토어 ID' })
    @IsOptional()
    @IsInt()
    storeId?: number;

    @ApiPropertyOptional({ description: '검색어' })
    @IsOptional()
    @IsString()
    keyword?: string;

    @ApiPropertyOptional({ description: '페이지', default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: '페이지 크기', default: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;
}
