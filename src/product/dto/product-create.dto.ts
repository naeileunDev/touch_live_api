import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { ProductOptionCreateDto } from "./product-option-create.dto";
import { Type } from "class-transformer";
import { UploadType } from "src/common/enums";
import { ProductFileDto } from "src/file/dto/product-file.dto";
import { ProductFlexibleCreateDto } from "./product-flexible-create.dto";

export class ProductCreateDto {

    @ApiProperty({ description: '등록 비용', type: Number })
    @IsOptional()
    @IsNumber()
    registerFee?: number;

    @ApiProperty({ description: '업로드 타입', enum: UploadType, default: UploadType.Normal })
    @IsEnum(UploadType)
    uploadType: UploadType = UploadType.Normal;

    @ApiProperty({ description: '단일 옵션 여부', type: Boolean, default: false })
    @IsBoolean()
    isMixed: boolean = false;

    @ApiProperty({ description: '옵션 목록', type: [ProductOptionCreateDto] })
    @IsOptional()
    @IsArray()
    @Type(() => ProductOptionCreateDto)
    options?: ProductOptionCreateDto[];

    @ApiProperty({ description: '상품 파일', type: ProductFileDto })
    @ValidateNested()
    @Type(() => ProductFileDto)
    productFiles: ProductFileDto;

    @ApiProperty({ description: '상품 상세', type: ProductFlexibleCreateDto })
    @ValidateNested()
    @Type(() => ProductFlexibleCreateDto)
    productFlexible: ProductFlexibleCreateDto;
}