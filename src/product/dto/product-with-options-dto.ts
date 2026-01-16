import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entity/product.entity";
import { ProductTargetGender } from "../enum/product-target-gender.enum";
import { ProductTargetAge } from "../enum/product-target-age.enum";
import { UploadType } from "src/common/enums";
import { ProductOptionDetailDto } from "./product-option-detail.dto";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ProductWithOptionsDto {

    @ApiProperty({ description: '상품명', example: '상품명' })
    name: string;

    @ApiProperty({ description: '가격', example: 10000 })
    price: number;

    @ApiProperty({ description: '구매 대상 성별', enum: ProductTargetGender, example: ProductTargetGender.Male })
    targetGender: ProductTargetGender;

    @ApiProperty({ description: '구매 대상 나이', enum: ProductTargetAge, example: ProductTargetAge.Adult })
    targetAge: ProductTargetAge;

    @ApiProperty({ description: '등록 비용', example: 1000 })
    registerFee: number;

    @ApiProperty({ description: '업로드 타입', enum: UploadType, example: UploadType.Normal })
    uploadType: UploadType;

    @ApiProperty({ description: '단일 옵션 여부', example: true })
    isMixed: boolean;

    @ApiProperty({ description: '재고(단일 옵션시)', example: 10 })
    stock?: number;

    @ApiProperty({ description: '해시 태그(최소 1개, 최대 3개까지)', example: ['해시 태그1', '해시 태그2', '해시 태그3'] })
    tags: string[];

    @ApiProperty({ description: '해당 상품 고시 정보', example: '해당 상품 고시 정보' })
    reqInfo: string;

    @ApiProperty({ description: '버전', example: new Date() })
    version: Date;

    @ApiProperty({ description: '노출 여부', example: true })
    isVisible: boolean;

    @ApiProperty({ description: '활성 여부', example: true })
    isActive: boolean;

    @ApiProperty({ description: '옵션 상세', type: ProductOptionDetailDto })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOptionDetailDto)
    options: ProductOptionDetailDto[];

    constructor(product: Product, options: ProductOptionDetailDto[]) {
        Object.assign(this, product);
        this.options = options;
    }
}