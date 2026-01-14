import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNumber } from "class-validator";
import { TermType } from "../enum/term-version.enum";
import { TermVersion } from "../entity/term-version.entity";
import { Type } from "class-transformer";
import { TermLogCreateDto } from "./term-log-create.dto";

export class UserTermLogDto {

    @ApiProperty({ description: '약관 타입', example: TermType.LocationBased, enum: TermType })
    @IsEnum(TermType)
    termType: TermType;

    @ApiProperty({ description: '동의 여부', example: true })
    @IsBoolean()
    isAgreed: boolean;

    @ApiProperty({ description: '약관 버전', example: TermVersion })
    @Type(() => TermVersion)
    termVersion: TermVersion;

    @ApiProperty({ description: '사용자 ID', example: 1 })
    @IsNumber()
    userId: number;

    constructor(dto: TermLogCreateDto, userId: number, termVersion: TermVersion) {
        this.termType = dto.termType;
        this.isAgreed = dto.isAgreed;
        this.termVersion = termVersion;
        this.userId = userId;
    }
}