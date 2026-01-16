import { ApiProperty } from "@nestjs/swagger";
import { FileCommonDto } from "./file-common-dto";
import { FileDto } from "./file.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ProductFileDto {
    @ApiProperty({ description: '썸네일 이미지', type: FileDto })
    @ValidateNested()
    @Type(() => FileDto)
    thumbnailImage: FileDto;

    @ApiProperty({ description: '정보 이미지', isArray: true, type: FileDto })
    @ValidateNested()
    @Type(() => FileDto)
    infoImages: FileDto[];

    @ApiProperty({ description: '상세 이미지', isArray: true, type: FileDto })
    @ValidateNested()
    @Type(() => FileDto)
    detailImages: FileDto[];

    constructor(thumbnailImage: FileDto, infoImages: FileDto[], detailImages: FileDto[]) {
        this.thumbnailImage = new FileDto(thumbnailImage);
        this.infoImages = infoImages.map(infoImage => new FileDto(infoImage));
        this.detailImages = detailImages.map(detailImage => new FileDto(detailImage));
    }

    static of(thumbnailImage: FileDto, infoImages: FileDto[], detailImages: FileDto[]): ProductFileDto {
        return new ProductFileDto(thumbnailImage, infoImages, detailImages);
    }
}