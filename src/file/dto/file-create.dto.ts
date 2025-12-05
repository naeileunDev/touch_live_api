import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { FileCategory } from "../enum/file-category.enum";

export class FileCreateDto {
    @ApiProperty({ description: '파일원래이름', example: '파일원래이름', required: true })
    @IsString({ always: true })
    originalName: string;
    @ApiProperty({ description: 'mime 타입', example: '파일타입', required: true })
    @IsString({ always: true })
    mimeType: string;
    @ApiProperty({ description: '파일크기', example: '파일크기', required: true })
    @IsNumber()
    size: number;

    @ApiProperty({ description: '파일 버퍼 base64 인코딩', example: '파일 버퍼 base64 인코딩' })
    base64?: string;
  
    constructor(file: Express.Multer.File){
      this.originalName = file.originalname;
      this.mimeType = file.mimetype;
      this.size = file.size;
      if (file.buffer) {
        this.base64 = file.buffer.toString('base64');
      }
    }

    @ApiProperty({ description: '파일 카테고리', example: FileCategory.User })
    @IsOptional()
    @IsEnum(FileCategory)
    category?: FileCategory = FileCategory.Temp;
}
