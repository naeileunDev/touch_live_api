import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileCreateDto } from './dto/file-create.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('File')
@Controller('file')
@ApiBearerAuth('access-token')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: '파일 저장' })
  saveLocal(@UploadedFile() file: Express.Multer.File) {
    //console.log(file);
    //this.fileService.saveLocalToUploads(file.originalname, file)
    return this.fileService.getVideoInfoFromBuffer(file) ;
  }

//   @Get()
//   findAll() {
//     return this.fileService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.fileService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
//     return this.fileService.update(+id, updateFileDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.fileService.remove(+id);
//   }
}
