import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchType } from 'src/common/enums';

export class CreateSearchHistoryDto {
    @ApiProperty({ description: '검색 타입', enum: SearchType })
    @IsEnum(SearchType)
    searchType: SearchType;

    @ApiProperty({ description: '검색어' })
    @IsString()
    @MaxLength(100)
    keyword: string;

    @ApiPropertyOptional({ description: '클릭한 결과 ID' })
    @IsOptional()
    @IsInt()
    clickedResultId?: number;
}
