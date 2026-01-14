import { ApiProperty } from "@nestjs/swagger";
import { FileCommonDto } from "./file-common-dto";
import { FileDto } from "./file.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UsageType } from "../enum/file-category.enum";

export class ProductFileDto {
    @ApiProperty({ description: '썸네일 이미지', type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    thumbnailImage: FileCommonDto;

    @ApiProperty({ description: '정보 이미지', type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    infoImage: FileCommonDto;

    @ApiProperty({ description: '상세 이미지', type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    detailImages: FileCommonDto;

    constructor(thumbnailImage: FileDto, infoImage: FileDto, detailImages: FileDto) {
        this.thumbnailImage = new FileCommonDto(thumbnailImage);
        this.infoImage = new FileCommonDto(infoImage);
        this.detailImages = new FileCommonDto(detailImages);
    }
    
    static of(files: FileDto[]): ProductFileDto {
        return new ProductFileDto(
            files.find(file => file.usageType === UsageType.Thumbnail)!,
            files.find(file => file.usageType === UsageType.InfoImage)!,
            files.find(file => file.usageType === UsageType.DetailImage)!,
        );
    }
}