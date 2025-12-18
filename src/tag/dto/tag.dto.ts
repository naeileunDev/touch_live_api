import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "../entity/tag.entity";
import { CATEGORY_FIELD_MAP, CategoryType } from "../enum/category-type.enum";
import { USAGE_FIELD_MAP, UsageType } from "../enum/usage-type.enum";
import { IsArray, IsEnum } from "class-validator";

export class TagDto {
    @ApiProperty({ description: '태그 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '태그 이름' , example: '태그1'})
    name: string;

    @ApiProperty({ description: '태그 카테고리 타입', example: [CategoryType.Food, CategoryType.Lifestyle], enum: CategoryType, isArray: true })
    @IsArray()
    @IsEnum(CategoryType, { each: true })
    category: CategoryType[];

    @ApiProperty({ description: '태그 용도', example: [UsageType.Store, UsageType.Product], enum: UsageType, isArray: true })
    @IsArray()
    @IsEnum(UsageType, { each: true })
    usage: UsageType[];

    constructor(tag: Tag) {
        this.id = tag.id;
        this.name = tag.name;
        this.category = Object.entries(CATEGORY_FIELD_MAP)
        .filter(([category, fieldName]) => tag[fieldName as keyof Tag] === true)
        .map(([category]) => category as CategoryType);
        this.usage =Object.entries(USAGE_FIELD_MAP)
        .filter(([usage, fieldName]) => tag[fieldName as keyof Tag] === true)
        .map(([usage]) => usage as UsageType);
    }
}