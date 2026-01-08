import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserFollowService } from './service/user-follow.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ALL_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { Role } from 'src/common/decorator/role.decorator';
import { UserDto } from 'src/user/dto';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { UserFollowsDto } from './dto/user-follows.dto';

@ApiTags('Follow')
@Controller('follow')
@ApiBearerAuth('access-token')
export class FollowController {
    constructor(private readonly userFollowService: UserFollowService) {}

    @Post('user/:userId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '팔로우/언팔로우 토글 (해당 유저 팔로우/언팔로우)' })
    @ApiOkSuccessResponse(Boolean, '팔로우/언팔로우 토글 성공')
    toggleFollow(@GetUser() user: UserDto, @Param('userId') userId: string): Promise<boolean> {
        return this.userFollowService.followAndUnfollow(user.id, userId);
    }

    @Get('user/followings/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로잉 목록 (무한 스크롤 용, 7개씩 조회 가능, liver의 팔로워 수는 followersCount에 표기됩니다. 9999 넘어가면 +9999로 표시해주세요)' })
    @ApiOkSuccessResponse(UserFollowsDto, '헤당 유저 팔로잉 목록 조회 성공')
    getFollowings(
        @Param('userId', ParseIntPipe) userId: string,
        @Query('lastId') lastId?: number,
    ): Promise<UserFollowsDto> {
        return this.userFollowService.findFollowingUsersFollowerCounts(userId, lastId, 7);
    }

    @Get('user/count/followings/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로잉 수' })
    @ApiOkSuccessResponse(Number, '해당 유저 팔로잉 수 조회 성공')
    getCountFollowings(
        @Param('userId', ParseIntPipe) userId: string, 
    ): Promise<number> {
        return this.userFollowService.findCountFollowOrFollower(userId, true);
    }

    @Get('user/count/followers/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로워 수 (팔로워의 경우 9999 넘어가면 +9999로 표시해주세요 => 팔로잉 유저의 팔로워 수 표기 용)' })
    @ApiOkSuccessResponse(Number, '해당 유저 팔로워 수 조회 성공')
    getCountFollowers(
        @Param('userId', ParseIntPipe) userId: string, 
    ): Promise<number> {
        return this.userFollowService.findCountFollowOrFollower(userId, false);
    }
}
