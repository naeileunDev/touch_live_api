import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { ANY_PERMISSION } from 'src/common/permission/permission';

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


}
