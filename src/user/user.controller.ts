import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from './service/user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { ADMIN_PERMISSION, ALL_PERMISSION, ANY_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { UserAddressCreateDto } from './dto/user-address-create.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserDto } from './dto/user.dto';
import { UserAddressDto } from './dto/user-address.dto';
import { UserAddressUpdateDto } from './dto/user-address-update.dto';
import { UserOperationDto } from './dto/user-operaion.dto';
import { UserOperationRequestDto } from './dto/user-operation-request.dto';
import { UserAddressService } from './service/user-address.service';
import { UserOperationService } from './service/user-operation.service';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userAddressService: UserAddressService,
        private readonly userOperationService: UserOperationService,
    ) { 
    }

    @Get('exists/login-id')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '로그인 아이디 중복 확인' })
    @ApiOkSuccessResponse(Boolean, '로그인 아이디 중복 확인 성공')
    existsLoginId(@Query('loginId') loginId: string): Promise<{exists: boolean}> {
        return this.userService.existsByLoginIdWithDeleted(loginId).then(result => ({ exists: result }));
    }

    @Get('exists/nickname')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '닉네임 중복 확인' })
    @ApiOkSuccessResponse(Boolean, '닉네임 중복 확인 성공')
    existsNickname(@Query('nickname') nickname: string): Promise<{exists: boolean}> {
        return this.userService.existsByNicknameWithDeleted(nickname).then(result => ({ exists: result }));
    }

    @Get('exists/email')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '이메일 중복 확인' })
    @ApiOkSuccessResponse(Boolean, '이메일 중복 확인 성공')
    existsEmail(@Query('email') email: string): Promise<{exists: boolean}> {
        return this.userService.existsByEmailWithDeleted(email).then(result => ({ exists: result }));
    }

    @Post('address')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '주소 등록' })
    @ApiOkSuccessResponse(UserAddressDto, '주소 등록 성공')
    registerAddress(@Body() userAddressCreateDto: UserAddressCreateDto, @GetUser() userDto: UserDto): Promise<UserAddressDto> {
        return this.userAddressService.create(userAddressCreateDto, userDto);
    }

    @Put('address/:id')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '주소 수정' })
    @ApiOkSuccessResponse(UserAddressDto, '주소 수정 성공')
    updateAddress(@Param('id') id: number, @Body() userAddressUpdateDto: UserAddressUpdateDto, @GetUser() userDto: UserDto): Promise<UserAddressDto> {
        return this.userAddressService.save(id, userAddressUpdateDto, userDto);
    }

    @Get('address')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '주소 목록 조회' })
    @ApiOkSuccessResponse(UserAddressDto, '주소 목록 조회 성공', true)
    findUserAddressAllByUserId(@GetUser() userDto: UserDto): Promise<UserAddressDto[]> {
        return this.userAddressService.findAllByUserId(userDto.id);
    }

    @Post('operation/role')
    @Role(ADMIN_PERMISSION)
    @ApiOperation({ summary: '해당 사용자를 운영자(매니저, 어드민)로 설정' })
    @ApiOkSuccessResponse(UserOperationDto, '운영자(매니저, 어드민) 권한 설정 성공')
    setOperationRole(@Body() userOperationRequestDto: UserOperationRequestDto): Promise<UserOperationDto> {
        return this.userOperationService.create(userOperationRequestDto);
    }

    @Put('operation/role')
    @Role(ADMIN_PERMISSION)
    @ApiOperation({ summary: '해당 사용자의 운영자(매니저, 어드민) 권한 변경' })
    @ApiOkSuccessResponse(UserOperationDto, '운영자(매니저, 어드민) 권한 변경 성공')
    modifyOperationRole(@Body() userOperationRequestDto: UserOperationRequestDto): Promise<UserOperationDto> {
        return this.userOperationService.save(userOperationRequestDto);
    }

}
