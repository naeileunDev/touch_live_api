import { ApiProperty } from "@nestjs/swagger";
import { UsageType } from "../enum/usage-type.enum";
import { CategoryType } from "../enum/category-type.enum";
import { TagFindCategoryDto } from "./tag-find-category.dto";
import { IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class TagFindResponseDto {
    @ApiProperty({ description: '태그 용도', example: UsageType.Store, enum: UsageType })
    @IsEnum(UsageType)
    usage: UsageType;

    @ApiProperty({ description: '태그 카테고리 리스트', type: [TagFindCategoryDto] })
    @ValidateNested({ each: true })
    @Type(() => TagFindCategoryDto)
    tagList: TagFindCategoryDto[];

    constructor(usage: UsageType, category: CategoryType[]) {
        this.usage = usage;
        this.tagList = category.map(category => ({
            category: category,
            tagList: []
        }));
    }
}