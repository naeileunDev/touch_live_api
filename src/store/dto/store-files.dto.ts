import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { FileCommonDto } from "src/file/dto/file-common-dto";
import { FileDto } from "src/file/dto/file.dto";

export class StoreFilesDto {
    @ApiProperty({ description: '사업자 등록증 이미지', type: FileCommonDto })
    businessRegistrationImage: FileCommonDto;

    @ApiProperty({ description: '통신판매업 신고증 이미지', type: FileCommonDto })
    eCommerceLicenseImage: FileCommonDto;

    @ApiProperty({ description: '사업자 정산계좌 이미지', type: FileCommonDto })
    accountImage: FileCommonDto;

    @ApiPropertyOptional({ description: '가게 프로필 이미지', type: FileCommonDto })
    @IsOptional()
    profileImage?: FileCommonDto;

    @ApiPropertyOptional({ description: '가게 배너 이미지', type: FileCommonDto })
    @IsOptional()
    bannerImage?: FileCommonDto;

    constructor(data: Record<string, FileDto>) {
        this.businessRegistrationImage = new FileCommonDto(data.businessRegistrationImage[0]);
        this.eCommerceLicenseImage = new FileCommonDto(data.eCommerceLicenseImage[0]);
        this.accountImage = new FileCommonDto(data.accountImage[0]);
        this.profileImage = data.profileImage ? new FileCommonDto(data.profileImage[0]) : null;
        this.bannerImage = data.bannerImage ? new FileCommonDto(data.bannerImage[0]) : null;
    }
}