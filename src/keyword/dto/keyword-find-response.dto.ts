import { ApiProperty } from "@nestjs/swagger";
import { UsageType } from "../enum/usage-type.enum";
import { CategoryType } from "../enum/category-type.enum";
import { IsArray, IsNumber, IsString } from "class-validator";

export class KeywordFindResponseDto {
    @ApiProperty({ description: '키워드 이름', example: ['키워드 이름1', '키워드 이름2'] })
    @IsString()
    @IsArray()
    name: string[];

    @ApiProperty({ description: '키워드 사용 타입', example: UsageType.Store })
    usage: UsageType;

    @ApiProperty({ description: '키워드 카테고리 타입', example: [CategoryType.Public, CategoryType.Food] })
    category: CategoryType[];

    @ApiProperty({ description: '키워드 총 개수', example: 10 })
    @IsNumber()
    total: number;
}