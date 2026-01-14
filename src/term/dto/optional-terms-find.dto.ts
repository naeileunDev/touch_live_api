import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";
import { TermType } from "../enum/term-version.enum";

export class OptionalTermsFindDto {
    @ApiProperty({ description: '약관 타입', example: TermType.LocationBased, enum: TermType })
    @IsEnum(TermType)
    termType: TermType;

    @ApiProperty({ description: '동의 여부', example: true })
    @IsBoolean()
    isAgreed: boolean;
}