import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, ParseIntPipe, UploadedFiles } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MediaValidationPipe } from './pipe/media-validation.pipe';
import { FileCreateDto } from './dto/file-create.dto';
import { ContentCategory, UsageType } from './enum/file-category.enum';
import { FileDto } from './dto/file.dto';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { StreamableFile } from '@nestjs/common';
import { Role } from 'src/common/decorator/role.decorator';
import { ALL_PERMISSION } from 'src/common/permission/permission';
import { StoreRegisterLogCreateFileDto } from './dto/store-register-log-create-file.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { StoreRegisterLogFilesDto } from './dto/store-register-log-files.dto';
import { StoreOwner } from 'src/common/decorator/store-owner.decorator';
import { ProductFileCreateDto } from './dto/product-file-create.dto';
import { ProductFileDto } from './dto/product-file.dto';

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
    @Role(ALL_PERMISSION)
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
    createLocal(@UploadedFile(MediaValidationPipe) file: Express.Multer.File, @Body() fileCreateDto: FileCreateDto) {
    return this.fileService.createLocal(file, fileCreateDto) ;
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

    @Post('store-register-log')
    @Role(ALL_PERMISSION)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'businessRegistrationImage', maxCount: 1 },
        { name: 'eCommerceLicenseImage', maxCount: 1 },
        { name: 'accountImage', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 },
    ]))
    @ApiOperation({ summary: '가게 등록 로그 파일 저장 ( 사업자 등록증, 통신판매업 신고증, 사업자 정산계좌, 가게 프로필, 가게 배너 )' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                businessRegistrationImage: { type: 'string', format: 'binary' },
                eCommerceLicenseImage: { type: 'string', format: 'binary' },
                accountImage: { type: 'string', format: 'binary' },
                profileImage: { type: 'string', format: 'binary' },
                bannerImage: { type: 'string', format: 'binary' },
            },
            required: ['businessRegistrationImage', 'eCommerceLicenseImage', 'accountImage', 'profileImage', 'bannerImage'],
        },
    })
    @ApiConsumes('multipart/form-data')
    @ApiOkSuccessResponse(StoreRegisterLogFilesDto, '가게 등록 로그 파일 저장 성공')
    createStoreRegisterLogFile(@UploadedFiles() files: Record<string, Express.Multer.File[]>, @GetUser() user: User): Promise<StoreRegisterLogFilesDto> {
        const createDto = StoreRegisterLogCreateFileDto.of(files);
        return this.fileService.createStoreRegisterLogFile(createDto, user);
    }
    
    @Post('product/:productId')
    @Role(ALL_PERMISSION)
    @StoreOwner()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'infoImage', maxCount: 1 },
        { name: 'detailImages', maxCount: 10 }
    ]))
    @ApiOperation({ summary: '상품 파일 저장 ( 썸네일 이미지, 정보 이미지, 상세 이미지(최대 10장) )' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                thumbnailImage: { type: 'string', format: 'binary' },
                infoImage: { type: 'string', format: 'binary' },
                detailImage: { 
                    type: 'array', 
                    items: { type: 'string', format: 'binary' },
                    description: '상세 이미지들 (최대 10 장 선택 가능)'
                },
            },
            
            required: ['thumbnailImage', 'infoImage', 'detailImage'],
        },
    })
    @ApiConsumes('multipart/form-data')
    @ApiOkSuccessResponse(ProductFileCreateDto, '상품 파일 저장 성공')
    createProductFile(
        @UploadedFiles() files: Record<string, Express.Multer.File[]>, 
        @GetUser() user: User,
        @Param('productId', ParseIntPipe) productId: number
    ): Promise<ProductFileDto> {
        const createDto = ProductFileCreateDto.of(files);
        return this.fileService.createProductFile(createDto, user, productId);
    }
}
