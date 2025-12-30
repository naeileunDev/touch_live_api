import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, ValidationPipe, UsePipes } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaValidationPipe } from './pipe/media-validation.pipe';
import { FileCreateDto } from './dto/file-create.dto';
import { ContentCategory, UsageType } from './enum/file-category.enum';
import { FileDto } from './dto/file.dto';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { StreamableFile } from '@nestjs/common';

@ApiTags('File')
@Controller('file')
@ApiBearerAuth('access-token')
export class FileController {
    constructor(
        private readonly fileService: FileService
    ) {}
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
    schema: {
        type: 'object',
        required: ['file', 'contentCategory', 'usageType'],
        properties: {
            file: { 
            type: 'string', 
            format: 'binary',
            description: '업로드할 파일'
            },
            contentCategory: { 
            type: 'string', 
            enum: Object.values(ContentCategory),
            description: '콘텐츠 카테고리',
            example: ContentCategory.User,
            },
            usageType: { 
            type: 'string', 
            enum: Object.values(UsageType),
            description: '파일 사용 용도',
            example: UsageType.Profile,
            },
            contentId: { 
            type: 'number',
            description: '콘텐츠 ID',
            example: 1,
            nullable: true,
            },
        },
    },
    })
    @ApiOperation({ summary: '파일 저장' })
    async saveLocal(@UploadedFile(MediaValidationPipe) file: Express.Multer.File, @Body() fileCreateDto: FileCreateDto) {
    return await this.fileService.saveLocalToUploads(file, fileCreateDto) ;
    }

    //   @Get()
    //   findAll() {
    //     return this.fileService.findAll();
    //   }

    @Get(':id')
    @ApiOperation({ summary: '파일 조회' })
    @ApiOkSuccessResponse(FileDto, '파일 조회 성공', true)
    async findOne(@Param('id') id: number) {
    return await this.fileService.findOne(id);
    }
    
    @Get('serve/:id')
    @ApiOperation({ summary: '파일 조회 및 표시 (브라우저에서 열기)' })
    @ApiResponse({ 
        status: 200, 
        description: '파일 반환 (이미지/비디오)',
        content: {
            'image/*': { schema: { type: 'string', format: 'binary' } },
            'video/*': { schema: { type: 'string', format: 'binary' } },
        }
    })
    async serveFile(@Param('id') id: number): Promise<StreamableFile> {
        return await this.fileService.serveFile(id);
    }
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
//     return this.fileService.update(+id, updateFileDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.fileService.remove(+id);
//   }
}
