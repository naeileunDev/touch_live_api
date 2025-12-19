import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "../entity/tag.entity";
import { IsNumber, IsString } from "class-validator";
import { Expose } from "class-transformer";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class TagCommonDto {
    @ApiProperty({ description: '태그 ID', example: 1, type: Number })
    @Expose()
    @IsNumber()
    id: number;

    @ApiProperty({ description: '태그 이름', example: '태그1', type: String })
    @Expose()
    @IsRequiredString()
    name: string;
}