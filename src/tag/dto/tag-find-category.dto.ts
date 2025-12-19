import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { CategoryType } from "../enum/category-type.enum";
import { TagCommonDto } from "./tag-common.dto";
import { Type } from "class-transformer";

export class TagFindCategoryDto {
    @ApiProperty({ description: '태그 카테고리 타입', example: CategoryType.Food, enum: CategoryType })
    @IsEnum(CategoryType)
    category: CategoryType;

    @ApiProperty({ description: '태그 리스트', type: [TagCommonDto] })
    @ValidateNested({ each: true })
    @Type(() => TagCommonDto)
    tagList: TagCommonDto[];
}