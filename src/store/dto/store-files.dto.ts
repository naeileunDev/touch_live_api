import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { FileDto } from "src/file/dto/file.dto";
import { UsageType } from "src/file/enum/file-category.enum";

export class StoreFilesDto {
    @ApiProperty({ description: '사업자 등록증 이미지', type: FileDto })
    @ValidateNested()
    @Type(() => FileDto)
    businessRegistrationImage: FileDto;

    @ApiProperty({ description: '통신판매업 신고증 이미지', type: FileDto })
    @ValidateNested()
    @Type(() => FileDto)
    eCommerceLicenseImage: FileDto;

    @ApiProperty({ description: '사업자 정산계좌 이미지', type: FileDto })
    @ValidateNested()
    @Type(() => FileDto)
    accountImage: FileDto;

    @ApiPropertyOptional({ description: '가게 프로필 이미지', type: FileDto })
    @ValidateNested()
    @Type(() => FileDto)
    profileImage: FileDto;

    @ApiPropertyOptional({ description: '가게 배너 이미지', type: FileDto })
    @ValidateNested()
    @Type(() => FileDto)
    bannerImage: FileDto;

    constructor(data: FileDto[]) {
        this.businessRegistrationImage = data.find(file => file.usageType === UsageType.BusinessRegistrationImage)!;
        this.eCommerceLicenseImage = data.find(file => file.usageType === UsageType.eCommerceLicenseImage)!;
        this.accountImage = data.find(file => file.usageType === UsageType.AccountImage)!;
        this.profileImage = data.find(file => file.usageType === UsageType.Profile)!;
        this.bannerImage = data.find(file => file.usageType === UsageType.Banner)!;
    }
}