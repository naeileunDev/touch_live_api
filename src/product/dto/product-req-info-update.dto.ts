import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class ProductReqInfoUpdateDto {
    @ApiProperty({ description: '상품 분류 이름', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: '상품 분류 속성 리스트', required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    itemList?: string[];
}