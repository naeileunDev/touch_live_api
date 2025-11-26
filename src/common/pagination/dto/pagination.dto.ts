import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class PaginationDto {
    @ApiProperty({ type: 'number', required: false, default: 1 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    page: number = 1;

    @ApiProperty({ type: 'number', required: false, default: 5 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    limit: number = 5;
}