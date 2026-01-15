import { ApiProperty } from "@nestjs/swagger";
import { StoreRegisterLogCreateFileDto } from "./store-register-log-create-file.dto";

export class ProductFileCreateDto {
    @ApiProperty({ description: '썸네일 이미지' })
    thumbnailImage: Express.Multer.File[];

    @ApiProperty({ description: '정보 이미지' })
    infoImages: Express.Multer.File[];

    @ApiProperty({ description: '상세 이미지' })
    detailImages: Express.Multer.File[];

    constructor(files: { [key: string]: Express.Multer.File[] }) {
        this.thumbnailImage = files?.thumbnailImage ?? [];
        this.infoImages = files?.infoImages ?? [];
        this.detailImages = files?.detailImages ?? [];
    }
    
    static of(files: { [key: string]: Express.Multer.File[] }): ProductFileCreateDto{
        return new ProductFileCreateDto({
          thumbnailImage: files?.thumbnailImage ?? [],
          infoImages: files?.infoImages ?? [],
          detailImages: files?.detailImages ?? [],
        });
      }
}