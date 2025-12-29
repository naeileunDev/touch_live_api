import { Controller, Post, Body, Param, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreCreateDto } from './dto/store-create.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiOperation, getSchemaPath } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { ALL_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { NonStoreOwner, StoreOwner } from 'src/common/decorator/store-owner.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MediaValidationPipeArray } from 'src/file/pipe/media-validation.pipe';
import { StoreCreateResponseDto } from './dto/store-create-response.dto';
import { ApiCreatedSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {
  }

  @Post()
  @Role(ALL_PERMISSION)
  @NonStoreOwner()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'businessRegistrationImage', maxCount: 1 },
    { name: 'eCommerceLicenseImage', maxCount: 1 },
    { name: 'accountImage', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]))
  @ApiExtraModels(StoreCreateDto)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
        type: 'object',
        allOf: [
            { $ref: getSchemaPath(StoreCreateDto) },
            {
                type: 'object',
                properties: {
                    businessRegistrationImage: { type: 'string', format: 'binary' },
                    eCommerceLicenseImage: { type: 'string', format: 'binary' },
                    accountImage: { type: 'string', format: 'binary' },
                    profileImage: { type: 'string', format: 'binary' },
                    bannerImage: { type: 'string', format: 'binary' },
                },
            },
        ],
    },
  })
  @ApiBearerAuth('access-token')
  @ApiExtraModels(StoreCreateResponseDto)
  @Role(USER_PERMISSION)
  @ApiOperation({ summary: '[유저 role] 가게 등록, 아직 가게를 등록하지 않았고, 로그상태가 null 또는 rejected인 경우 가게 등록 가능' })
  @ApiCreatedSuccessResponse(StoreCreateResponseDto, '가게 등록 성공')
  async applyStoreCreate(
    @Body() storeCreateDto: StoreCreateDto,
    @GetUser() user: User, 
    @UploadedFiles(MediaValidationPipeArray) files: {
        businessRegistrationImage: Express.Multer.File[],
        eCommerceLicenseImage: Express.Multer.File[],
        accountImage: Express.Multer.File[],
        profileImage: Express.Multer.File[],
        bannerImage: Express.Multer.File[],
    }): Promise<StoreCreateResponseDto> {
        return await this.storeService.create(storeCreateDto, user, files);
    }

  @Get('register-log/:id')
  @Role(ALL_PERMISSION)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '[모든 role] 가게 등록 로그 조회, 단 유저의 경우 본인 가게 등록 로그만 조회 가능합니다.' })
  async get(@GetUser() user: User, @Param('id') id: number) {
    return await this.storeService.getRegisterLog(id, user);
  }
}


