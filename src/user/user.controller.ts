import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { ALL_PERMISSION, ANY_PERMISSION } from 'src/common/permission/permission';
import { UserAddressCreateDto } from './dto/user-address-create.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserDto } from './dto/user.dto';
import { UserAddressDto } from './dto/user-address.dto';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('access-token')
export class UserController {
    constructor(private readonly userService: UserService) { 
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

    @Post('register/address')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '주소 등록' })
    @ApiOkSuccessResponse(UserAddressDto, '주소 등록 성공')
    registerAddress(@Body() userAddressCreateDto: UserAddressCreateDto, @GetUser() userDto: UserDto): Promise<UserAddressDto> {
        return this.userService.registerAddress(userAddressCreateDto, userDto);
    }



}
