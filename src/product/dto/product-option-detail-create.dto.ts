import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";
import { ProductCreateDto } from "./product-create.dto";

export class ProductOptionDetailCreateDto {
    @ApiProperty({ description: '옵션 상세명' })
    @IsRequiredString()
    name: string;

    @ApiProperty({ description: '수량' })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ description: '조합 옵션 여부', type: Boolean, example: true, default: true })
    @IsBoolean()
    isMixed: boolean = true;

    @ApiPropertyOptional({ description: '추가 요금', type: Number, example: 1000 })
    @IsNumber()
    extraFee: number;

    @ApiProperty({ description: '옵션 상세 이미지 ID' })
    @IsNumber()
    fileId: number;

    @ApiPropertyOptional({ description: '버전', example: new Date() })
    @Type(() => Date)
    @IsOptional()
    version?: Date

    @ApiPropertyOptional({ description: '상품 ID', example: 1 })
    @IsOptional()
    @IsNumber()
    productId?: number;

    constructor(dto: ProductOptionDetailCreateDto, fileId?: number, productId?: number) {
        Object.assign(this, dto);
        this.fileId = fileId;
        this.productId = productId;
    }
}