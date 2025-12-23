import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { FileCommonDto } from "src/file/dto/file-common-dto";
import { FileDto } from "src/file/dto/file.dto";
import { UsageType } from "src/file/enum/file-category.enum";

export class StoreFilesDto {
    @ApiProperty({ description: '사업자 등록증 이미지', type: Number })
    businessRegistrationImageId: number;

    @ApiProperty({ description: '통신판매업 신고증 이미지', type: Number })
    eCommerceLicenseImageId: number;

    @ApiProperty({ description: '사업자 정산계좌 이미지', type: Number })
    accountImageId: number;

    @ApiPropertyOptional({ description: '가게 프로필 이미지', type: Number })
    @IsOptional()
    profileImageId?: number;

    @ApiPropertyOptional({ description: '가게 배너 이미지', type: Number })
    @IsOptional()
    bannerImageId?: number;

    constructor(data: Map<UsageType, number>) {
        this.businessRegistrationImageId = data.get(UsageType.BusinessRegistrationImage);
        this.eCommerceLicenseImageId = data.get(UsageType.eCommerceLicenseImage);
        this.accountImageId = data.get(UsageType.AccountImage);
        this.profileImageId = data.get(UsageType.Profile) ?? null;
        this.bannerImageId = data.get(UsageType.Banner) ?? null;
    }
}