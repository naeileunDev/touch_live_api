import { ApiProperty } from "@nestjs/swagger";
import { FileCommonDto } from "./file-common-dto";
import { FileDto } from "./file.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UsageType } from "../enum/file-category.enum";

export class StoreRegisterLogFilesDto {
    @ApiProperty({ description: '사업자 등록증 이미지', type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    businessRegistrationImage: FileCommonDto;

    @ApiProperty({ description: '통신판매업 신고증 이미지', type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    eCommerceLicenseImage: FileCommonDto;

    @ApiProperty({ description: '사업자 정산계좌 이미지', type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    accountImage: FileCommonDto;

    @ApiProperty({ description: '가게 프로필 이미지', type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    profileImage: FileCommonDto;
    
    @ApiProperty({ description: '가게 배너 이미지', type: FileCommonDto })
    @ValidateNested()
    @Type(() => FileCommonDto)
    bannerImage: FileCommonDto;

    constructor(businessRegistrationImage: FileDto, eCommerceLicenseImage: FileDto, accountImage: FileDto, profileImage: FileDto, bannerImage: FileDto) {
        this.businessRegistrationImage = new FileCommonDto(businessRegistrationImage);
        this.eCommerceLicenseImage = new FileCommonDto(eCommerceLicenseImage);
        this.accountImage = new FileCommonDto(accountImage);
        this.profileImage = new FileCommonDto(profileImage);
        this.bannerImage = new FileCommonDto(bannerImage);
    }
    
    static of(files: FileDto[]): StoreRegisterLogFilesDto {
        return new StoreRegisterLogFilesDto(
            files.find(file => file.usageType === UsageType.BusinessRegistrationImage)!,
            files.find(file => file.usageType === UsageType.eCommerceLicenseImage)!,
            files.find(file => file.usageType === UsageType.AccountImage)!,
            files.find(file => file.usageType === UsageType.Profile)!,
            files.find(file => file.usageType === UsageType.Banner)!,
        );
    }
}