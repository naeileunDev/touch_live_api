import { ApiProperty } from "@nestjs/swagger";
import { UsageType } from "../enum/usage-type.enum";
import { CategoryType } from "../enum/category-type.enum";
import { IsEnum, IsNotIn } from "class-validator";

export class KeywordFindDto {
    @ApiProperty({ description: '키워드 사용 타입', example: UsageType.Store })
    @IsEnum(UsageType)
    usage: UsageType;

    @ApiProperty({ description: '키워드 카테고리 타입', example: CategoryType.Public })
    @IsEnum(CategoryType)
    @IsNotIn([CategoryType.Public])
    category: CategoryType;
}