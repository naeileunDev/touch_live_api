import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({ type: 'number', required: false, description: '페이지 번호 or 마지막 아이템의 id (무한 스크롤 용)', default: 1 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    page?: number;

    @ApiProperty({ type: 'number', required: false, default: 5 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    limit?: number;

}