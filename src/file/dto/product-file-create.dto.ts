import { ApiProperty } from "@nestjs/swagger";
import { StoreRegisterLogCreateFileDto } from "./store-register-log-create-file.dto";

export class ProductFileCreateDto {
    @ApiProperty({ description: '썸네일 이미지' })
    thumbnailImage: Express.Multer.File[];

    @ApiProperty({ description: '정보 이미지' })
    infoImage: Express.Multer.File[];

    @ApiProperty({ description: '상세 이미지' })
    detailImages: Express.Multer.File[];

    constructor(files: { [key: string]: Express.Multer.File[] }) {
        this.thumbnailImage = files?.thumbnailImage ?? [];
        this.infoImage = files?.infoImage ?? [];
        this.detailImages = files?.detailImages ?? [];
    }
    
    static of(files: { [key: string]: Express.Multer.File[] }): ProductFileCreateDto{
        return new ProductFileCreateDto({
          thumbnailImage: files?.thumbnailImage ?? [],
          infoImage: files?.infoImage ?? [],
          detailImages: files?.detailImages ?? [],
        });
      }
}