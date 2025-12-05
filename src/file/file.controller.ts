import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FileService } from './file.service';
import { FileCreateDto } from './dto/file-create.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('File')
@Controller('file')
@ApiBearerAuth('access-token')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  saveLocal(@Body()fileCreateDto: FileCreateDto) {
    return this.fileService.saveLocalToUploads(fileCreateDto);
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
