import { Controller, Post, Body, Param, Get, UseInterceptors, UploadedFiles, ParseIntPipe, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreRegisterLogCreateDto } from './dto/store-register-log-create.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { ALL_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { NonStoreOwner } from 'src/common/decorator/store-owner.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MediaValidationPipeArray } from 'src/file/pipe/media-validation.pipe';
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { StoreRegisterLogCreateResponseDto } from './dto/store-register-log-create-response.dto';
import { StoreRegisterLogDto } from './dto/store-register-log.dto';
import { StoreRegisterLogService } from './store-register-log.service';

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
    @ApiOperation({ summary: '[유저 role] 가게 등록, 가게 등록 로그 파일 저장도 함께 호출, 아직 가게를 등록하지 않았고, 로그상태가 null 또는 rejected인 경우 가게 등록 가능' })
    @ApiCreatedSuccessResponse(StoreRegisterLogCreateResponseDto, '가게 등록 성공')
    createRegisterLog (
        @Body() createDto: StoreRegisterLogCreateDto,
        @GetUser() user: User, 
        ): Promise<StoreRegisterLogCreateResponseDto> {
            return this.storeRegisterLogService.create(createDto, user);
        }

    @Get('register-log/:id')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 가게 등록 로그 조회, 단 유저의 경우 본인 가게 등록 로그만 조회 가능합니다.' })
    @ApiOkSuccessResponse(StoreRegisterLogDto, '가게 등록 로그 조회 성공')
    findRegisterLogById(@GetUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<StoreRegisterLogDto> {
        return this.storeRegisterLogService.findById(id, user);
    }

    @Get('register-log')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 사용자별 가게 등록 로그 목록 조회, 단 유저의 경우 본인 가게 등록 로그만 조회 가능합니다.' })
    @ApiOkSuccessResponse(StoreRegisterLogDto, '가게 등록 로그 목록 조회 성공', true)
    findByRegisterLogUserId(@GetUser() user: User, @Query('userId') userId: string): Promise<StoreRegisterLogDto[]> {
        return this.storeRegisterLogService.findByUserId(userId, user);
    }
}


