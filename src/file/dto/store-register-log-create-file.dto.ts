import { ApiProperty } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

export class StoreRegisterLogCreateFileDto {
    @ApiProperty({ description: '사업자 등록증 이미지' })
    businessRegistrationImage: Express.Multer.File[];
    
    @ApiProperty({ description: '통신판매업 신고증 이미지' })
    eCommerceLicenseImage: Express.Multer.File[];
    
    @ApiProperty({ description: '사업자 정산계좌 이미지' })
    accountImage: Express.Multer.File[];
    
    @ApiProperty({ description: '가게 프로필 이미지' })
    profileImage: Express.Multer.File[];
    
    @ApiProperty({ description: '가게 배너 이미지' })
    bannerImage: Express.Multer.File[];

    constructor(files: { [key: string]: Express.Multer.File[] }) {
        this.businessRegistrationImage = files?.businessRegistrationImage ?? [];
        this.eCommerceLicenseImage = files?.eCommerceLicenseImage ?? [];
        this.accountImage = files?.accountImage ?? [];
        this.profileImage = files?.profileImage ?? [];
        this.bannerImage = files?.bannerImage ?? [];
    }
    
    static of(files: { [key: string]: Express.Multer.File[] }): StoreRegisterLogCreateFileDto {
        return new StoreRegisterLogCreateFileDto({
          businessRegistrationImage: files?.businessRegistrationImage ?? [],
          eCommerceLicenseImage: files?.eCommerceLicenseImage ?? [],
          accountImage: files?.accountImage ?? [],
          profileImage: files?.profileImage ?? [],
          bannerImage: files?.bannerImage ?? [],
        });
      }
}