import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, MaxLength, MinLength } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class TagCheckDto {
    @ApiProperty({ description: '메인태그', example: ['태그1', '태그2', '태그3'], isArray: true })
    @IsArray()
    @IsString({ each: true })
    @MinLength(1)
    @MaxLength(3)
    mainTags: string[];

    @ApiProperty({ description: '서브태그', example: ['태그1', '태그2', '태그3'], isArray: true })
    @IsArray()
    @IsString({ each: true })
    @MinLength(1)
    @MaxLength(3)
    subTags: string[];
}
