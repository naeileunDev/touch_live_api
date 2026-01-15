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

    @ApiProperty({ description: '정보 이미지', isArray: true, type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    infoImages: FileCommonDto[];

    @ApiProperty({ description: '상세 이미지', isArray: true, type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    detailImages: FileCommonDto[];

    constructor(thumbnailImage: FileDto, infoImages: FileDto[], detailImages: FileDto[]) {
        this.thumbnailImage = new FileCommonDto(thumbnailImage);
        this.infoImages = infoImages.map(infoImage => new FileCommonDto(infoImage));
        this.detailImages = detailImages.map(detailImage => new FileCommonDto(detailImage));
    }

    static of(thumbnailImage: FileDto, infoImages: FileDto[], detailImages: FileDto[]): ProductFileDto {
        return new ProductFileDto(thumbnailImage, infoImages, detailImages);
    }
}