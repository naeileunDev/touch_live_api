import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { FileDto } from "./file.dto";

export class FileCommonDto {
    @ApiProperty({ description: '파일 식별자', example: 1, type: Number })
    @IsNumber()
    @IsOptional()
    id: number;

    @ApiProperty({ description: '파일 경로', example: 'https://example.com/test.jpg' })
    @IsString()
    fileUrl: string;

    constructor(data: FileDto) {
        this.id = data.id;
        this.fileUrl = data.fileUrl;
    }
}