import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { ResolutionGradeType } from "../enum/resolution-grade-type.enum";

export class VideoInfoDto {
    @ApiProperty({ description: '영상 길이', example: 100 })
    @IsNumber()
    duration: number;
    
    @ApiProperty({ description: '영상 너비', example: 1920 })
    @IsNumber()
    width: number;
    
    @ApiProperty({ description: '영상 높이', example: 1080 })
    @IsNumber()
    height: number;

    @ApiProperty({ description: '영상 해상도 등급', example: ResolutionGradeType.FOURK })
    @IsEnum(ResolutionGradeType)
    resolutionGrade: ResolutionGradeType;
    
    @ApiProperty({ description: '영상 비트레이트', example: 1000000 })
    @IsNumber()
    bitrate: number;
    
    @ApiProperty({ description: '영상 코덱', example: 'h264' })
    @IsString()
    codec: string;
    @ApiProperty({ description: '영상 포맷', example: 'mp4' })
    format: string;
    
    @ApiProperty({ description: '영상 크기', example: 1000000 })
    @IsNumber()
    size: number;

    constructor(duration: number, width: number, height: number, bitrate: number, codec: string, format: string, size: number, resolutionGrade: ResolutionGradeType) {
        this.duration = duration;
        this.width = width;
        this.height = height;
        this.bitrate = bitrate;
        this.codec = codec;
        this.format = format;
        this.size = size;
        this.resolutionGrade = resolutionGrade;
    }
}