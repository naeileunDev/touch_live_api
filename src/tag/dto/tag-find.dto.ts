import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CategoryType } from "../enum/category-type.enum";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { UsageType } from "../enum/usage-type.enum";
import { Transform } from "class-transformer";

export class TagFindDto {
    @ApiPropertyOptional({ 
        description: '태그 카테고리 타입', 
        example: [CategoryType.Food, CategoryType.Lifestyle], 
        enum: CategoryType,
        isArray: true
    })
    @IsArray()
    @IsEnum(CategoryType, { each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return undefined;
        return Array.isArray(value) ? value : [value];
    })
    category?: CategoryType[];

    @ApiPropertyOptional({
        description: '태그 용도 ',
        example: [UsageType.Store, UsageType.Product],
        enum: UsageType,
        isArray: true
    })
    @IsArray()
    @IsEnum(UsageType, { each: true })
    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return undefined;
        return Array.isArray(value) ? value : [value];
    })
    usage?: UsageType[];
}