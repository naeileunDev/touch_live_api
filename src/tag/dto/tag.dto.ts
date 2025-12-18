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

    // structureCategory(tag: Tag): CategoryType[] {
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Food]}`] === true) {
    //         return [CategoryType.Food];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Lifestyle]}`] === true) {
    //         return [CategoryType.Lifestyle];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Fashion]}`] === true) {
    //         return [CategoryType.Fashion];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Beauty]}`] === true) {
    //         return [CategoryType.Beauty];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Health]}`] === true) {
    //         return [CategoryType.Health];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Tech]}`] === true) {
    //         return [CategoryType.Tech];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Interior]}`] === true) {
    //         return [CategoryType.Interior];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Travel]}`] === true) {
    //         return [CategoryType.Travel];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.HobbyLeisure]}`] === true) {
    //         return [CategoryType.HobbyLeisure];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Kids]}`] === true) {
    //         return [CategoryType.Kids];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Pet]}`] === true) {
    //         return [CategoryType.Pet];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Car]}`] === true) {
    //         return [CategoryType.Car];
    //     }
    //     if (tag[`is${CATEGORY_FIELD_MAP[CategoryType.Kitchen]}`] === true) {
    //         return [CategoryType.Kitchen];
    //     }
    //     return [];
    // }

    // structureUsage(tag: Tag): UsageType[] {
    //     if (tag.isStoreTag) {
    //         return [UsageType.Store];
    //     }
    //     if (tag.isProductTag) {
    //         return [UsageType.Product];
    //     }
    //     return [];
    // }
}