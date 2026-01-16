import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, ParseIntPipe, UploadedFiles, ParseEnumPipe } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileCreateDto } from './dto/file-create.dto';
import { ContentCategory, UsageType } from './enum/file-category.enum';
import { FileDto } from './dto/file.dto';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { StreamableFile } from '@nestjs/common';
import { Role } from 'src/common/decorator/role.decorator';
import { ANY_PERMISSION } from 'src/common/permission/permission';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from 'src/user/entity/user.entity';

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
    @Role(ANY_PERMISSION)
    // dto 와 파일 업로드를 동시에 입력하면 swagger 에서 오류가 발생하므로 ApiBody 별도로 작성
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
            description: '콘텐츠 카테고리',
            example: ContentCategory.User,
            },
            usageType: { 
            type: 'string', 
            description: '파일 사용 용도',
            example: UsageType.Profile,
            },
            contentId: { 
            type: 'number',
            description: '콘텐츠 ID',
            example: 1,
            nullable: true,
            },
            field: { 
            type: 'string', 
            description: '필드 이름',
            example: 'thumbnailImage or 블랙/m 등',
            nullable: true,
            },
        },
    },
    })
    @ApiOperation({ summary: '파일 저장' })
    createLocal(
        @UploadedFile() file: Express.Multer.File, 
        @Body() fileCreateDto: FileCreateDto,
        @GetUser() user: User,
    ): Promise<FileDto> {
    return this.fileService.createLocal(file, fileCreateDto, user);
    }


    @Get(':id')
    @ApiOperation({ summary: '파일 조회' })
    @ApiOkSuccessResponse(FileDto, '파일 조회 성공', true)
    findById(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.findById(id);
    }
    
    @Get('test/:id')
    @ApiOperation({ summary: '파일 조회 및 표시 (브라우저에서 열기)' })
    @ApiResponse({ 
        status: 200, 
        description: '파일 반환 (이미지/비디오)',
        content: {
            'image/*': { schema: { type: 'string', format: 'binary' } },
            'video/*': { schema: { type: 'string', format: 'binary' } },
        }
    })
    findByIdAndServe(@Param('id') id: number): Promise<StreamableFile> {
        return this.fileService.findByIdAndServe(id);
    }
}
