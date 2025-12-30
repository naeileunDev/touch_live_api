import { ApiProperty } from "@nestjs/swagger";
import { UsageType } from "../enum/usage-type.enum";
import { CategoryType } from "../enum/category-type.enum";
import { TagFindCategoryDto } from "./tag-find-category.dto";
import { IsEnum, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class TagFindDto {
    @ApiProperty({ description: '태그 용도', example: UsageType.Store, enum: UsageType })
    @IsEnum(UsageType)
    usage: UsageType;

    @ApiProperty({ description: '태그 카테고리 타입', example: CategoryType.Food, enum: CategoryType })
    @IsEnum(CategoryType)
    category: CategoryType;

    @ApiProperty({ description: '태그 리스트', example: ['태그1', '태그2', '태그3'], isArray: true })
    @IsString({ each: true })
    tagList: string[];

    constructor(usage: UsageType, category: CategoryType, tagList:string[]) {
        this.usage = usage;
        this.category = category;
        this.tagList = tagList;
    }
}