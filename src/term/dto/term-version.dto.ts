import { ApiProperty } from "@nestjs/swagger";
import { TermType } from "../enum/term-version.enum";
import { IsBoolean, IsEnum } from "class-validator";
import { TermVersion } from "../entity/term-version.entity";

export class TermVersionDto {
    @ApiProperty({ description: '약관 버전 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '약관 타입', example: TermType.LocationBased, enum: TermType })
    @IsEnum(TermType)
    termType: TermType;

    @ApiProperty({ description: '약관 내용', example: '약관 내용' })
    content: string;

    @ApiProperty({ description: '약관 버전', example: '2025-01-01T12:00:00.000Z' })
    version: Date;

    @ApiProperty({ description: '필수 여부', example: true })
    @IsBoolean()
    isRequired: boolean;

    constructor(termVersion: TermVersion) {
        this.id = termVersion.id;
        this.termType = termVersion.termType;
        this.content = termVersion.content;
        this.version = termVersion.version;
        this.isRequired = termVersion.isRequired;
    }
}