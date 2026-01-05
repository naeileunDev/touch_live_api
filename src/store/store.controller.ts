import { Controller, Post, Body, Param, Get, UseInterceptors, UploadedFiles, ParseIntPipe, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreRegisterLogCreateDto } from './dto/store-register-log-create.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { ALL_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { NonStoreOwner, StoreOwner } from 'src/common/decorator/store-owner.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MediaValidationPipeArray } from 'src/file/pipe/media-validation.pipe';
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { StoreRegisterLogCreateResponseDto } from './dto/store-register-log-create-response.dto';
import { StoreRegisterLogDto } from './dto/store-register-log.dto';
import { StoreRegisterLogService } from './store-register-log.service';
import { UserDto } from 'src/user/dto';

@ApiTags('Store')
@Controller('store')
@ApiBearerAuth('access-token')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly storeRegisterLogService: StoreRegisterLogService,
  ) {
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
  @ApiExtraModels(StoreRegisterLogCreateDto)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
        type: 'object',
        allOf: [
            { $ref: getSchemaPath(StoreRegisterLogCreateDto) },
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
  @ApiExtraModels(StoreRegisterLogCreateResponseDto)
  @Role(USER_PERMISSION)
  @ApiOperation({ summary: '[유저 role] 가게 등록, 아직 가게를 등록하지 않았고, 로그상태가 null 또는 rejected인 경우 가게 등록 가능' })
  @ApiCreatedSuccessResponse(StoreRegisterLogCreateResponseDto, '가게 등록 성공')
  async createRegisterLog (
    @Body() createDto: StoreRegisterLogCreateDto,
    @GetUser() user: User, 
    @UploadedFiles(MediaValidationPipeArray) files: {
        businessRegistrationImage: Express.Multer.File[],
        eCommerceLicenseImage: Express.Multer.File[],
        accountImage: Express.Multer.File[],
        profileImage: Express.Multer.File[],
        bannerImage: Express.Multer.File[],
    }): Promise<StoreRegisterLogCreateResponseDto> {
        return await this.storeRegisterLogService.create(createDto, user, files);
    }

  @Get('register-log/search')
  @Role(ALL_PERMISSION)
  @ApiOperation({ summary: '[모든 role] 가게 등록 로그 조회, 단 유저의 경우 본인 가게 등록 로그만 조회 가능합니다.' })
  @ApiOkSuccessResponse(StoreRegisterLogCreateResponseDto, '가게 등록 로그 조회 성공')
  async findById(@GetUser() user: UserDto, @Query('id', ParseIntPipe) id: number): Promise<StoreRegisterLogDto> {
    return await this.storeRegisterLogService.findById(id, user);
  }


  @Get('register-log/user')
  @Role(ALL_PERMISSION)
  @ApiOperation({ summary: '[모든 role] 가게 등록 로그 조회, 단 유저의 경우 본인 가게 등록 로그만 조회 가능합니다.' })
  @ApiOkSuccessResponse(StoreRegisterLogDto, '가게 등록 로그 조회 성공', true)
  async findByRegisterLogUserId(@GetUser() user: UserDto, @Query('userId') userId: string): Promise<StoreRegisterLogDto[]> {
    return await this.storeRegisterLogService.findByUserId(userId, user);
  }
}


