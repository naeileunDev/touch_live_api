import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
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

    constructor(data: Map<UsageType, {id: number, url: string}>) {
        this.businessRegistrationImage = data.get(UsageType.BusinessRegistrationImage) ?? null;
        this.eCommerceLicenseImage = data.get(UsageType.eCommerceLicenseImage) ?? null;
        this.accountImage = data.get(UsageType.AccountImage) ?? null;
        this.profileImage = data.get(UsageType.Profile) ?? null;
        this.bannerImage = data.get(UsageType.Banner) ?? null;
    }
}