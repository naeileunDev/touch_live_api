import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { FileDto } from "src/file/dto/file.dto";
import { UsageType } from "src/file/enum/file-category.enum";

export class ProductFilesDto {
    @ApiProperty({ description: '썸네일 이미지', type: FileDto, isArray: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    thumbnailImage: FileDto[];

    @ApiProperty({ description: '정보 이미지', type: FileDto, isArray: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    infoImages: FileDto[];

    @ApiProperty({ description: '상세 이미지', type: FileDto, isArray: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    detailImages: FileDto[];

    @ApiProperty({ description: '옵션 상세 이미지', type: FileDto, isArray: true })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    optionImages: FileDto[];

    constructor(data: FileDto[] = []) {
        const fileArray = Array.isArray(data) ? data : [];
        this.thumbnailImage = fileArray.filter(file => file?.usageType === UsageType.Thumbnail);
        this.infoImages = fileArray.filter(file => file?.usageType === UsageType.InfoImage);
        this.detailImages = fileArray.filter(file => file?.usageType === UsageType.DetailImage);
        this.optionImages = fileArray.filter(file => file?.usageType === UsageType.OptionImage);
    }
}