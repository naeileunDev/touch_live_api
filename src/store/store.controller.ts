import { Controller, Post, Body, Param, Get, UseInterceptors, UploadedFiles, UsePipes, ValidationPipe, ClassSerializerInterceptor} from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreCreateDto } from './dto/store-create.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { ALL_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { NonStoreOwner, StoreOwner } from 'src/common/decorator/store-owner.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaValidationPipe, MediaValidationPipeArray } from 'src/file/pipe/media-validation.pipe';
import { TagCommonDto } from 'src/tag/dto/tag-common.dto';
import { plainToInstance } from 'class-transformer';

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
  @ApiExtraModels(TagCommonDto)
  async create(
    @Body() storeCreateDto: StoreCreateDto,
    @GetUser() user: User, 
    @UploadedFiles(MediaValidationPipeArray) files: {
        businessRegistrationImage: Express.Multer.File[],
        eCommerceLicenseImage: Express.Multer.File[],
        accountImage: Express.Multer.File[],
        profileImage: Express.Multer.File[],
        bannerImage: Express.Multer.File[],
    }) {
        //console.log( "plainToInstance(StoreCreateDto, storeCreateDto)", plainToInstance(StoreCreateDto, storeCreateDto));
        //console.log(storeCreateDto);
        //console.log(files);
        
        const store = await this.storeService.create(storeCreateDto, user, files);
        return store;
    }

  @Get()
  @Role(USER_PERMISSION)
  @StoreOwner()
  @ApiBearerAuth('access-token')
  get(@GetUser() user: User) {
    return 'This action returns a store';
  }
}

