import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsString } from "class-validator";
import { CategoryType } from "../enum/category-type.enum";

export class TagFindCategoryDto {
    @ApiProperty({ description: '태그 카테고리 타입', example: CategoryType.Food, enum: CategoryType })
    @IsEnum(CategoryType)
    category: CategoryType;

    @ApiProperty({ description: '태그 이름 리스트', example: ['한식', '중식'] })
    @IsArray()
    @IsString({ each: true })
    tagList: string[];
}