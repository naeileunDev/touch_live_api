import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { FileDto } from "src/file/dto/file.dto";
import { UsageType } from "src/file/enum/file-category.enum";

export class StoreFilesDto {
    @ApiProperty({ description: '사업자 등록증 이미지', type: Object, example: {id: 1, url: 'https://example.com/test.jpg'} })
    businessRegistrationImage: {id: number, url: string};

    @ApiProperty({ description: '통신판매업 신고증 이미지', type: Object, example: {id: 1, url: 'https://example.com/test.jpg'} })
    eCommerceLicenseImage: {id: number, url: string};

    @ApiProperty({ description: '사업자 정산계좌 이미지', type: Object, example: {id: 1, url: 'https://example.com/test.jpg'} })
    accountImage: {id: number, url: string};

    @ApiPropertyOptional({ description: '가게 프로필 이미지', type: Object, example: {id: 1, url: 'https://example.com/test.jpg'} })
    @IsOptional()
    profileImage?: {id: number, url: string};

    @ApiPropertyOptional({ description: '가게 배너 이미지', type: Object, example: {id: 1, url: 'https://example.com/test.jpg'} })
    @IsOptional()
    bannerImage?: {id: number, url: string};

    constructor(data: FileDto[]) {
        this.businessRegistrationImage = {id: data.find(file => file.usageType === UsageType.BusinessRegistrationImage)!.id, url: data.find(file => file.usageType === UsageType.BusinessRegistrationImage)!.fileUrl};
        this.eCommerceLicenseImage = {id: data.find(file => file.usageType === UsageType.eCommerceLicenseImage)!.id, url: data.find(file => file.usageType === UsageType.eCommerceLicenseImage)!.fileUrl};
        this.accountImage = {id: data.find(file => file.usageType === UsageType.AccountImage)!.id, url: data.find(file => file.usageType === UsageType.AccountImage)!.fileUrl};
        this.profileImage = {id: data.find(file => file.usageType === UsageType.Profile)!.id, url: data.find(file => file.usageType === UsageType.Profile)!.fileUrl};
        this.bannerImage = {id: data.find(file => file.usageType === UsageType.Banner)!.id, url: data.find(file => file.usageType === UsageType.Banner)!.fileUrl};
    }
}