import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserFollowService } from './service/user-follow.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ALL_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { Role } from 'src/common/decorator/role.decorator';
import { UserDto } from 'src/user/dto';

@ApiTags('Follow')
@Controller('follow')
@ApiBearerAuth('access-token')
export class FollowController {
    constructor(private readonly userFollowService: UserFollowService) {}

    @Post(':userId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '팔로우/언팔로우 토글 (해당 유저 팔로우/언팔로우)' })
    async toggle(
        @GetUser() user: UserDto,
        @Param('userId') userId: string,
    ) {
        return this.userFollowService.followAndUnfollow(user.id, userId);
    }

    @Get('followers/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로워 목록' })
    async getFollowers(
        @Param('userId', ParseIntPipe) userId: string,
        @Query('lastId') lastId?: number,
        @Query('limit') limit: number = 7,
    ) {
        return this.userFollowService.findFollowers(userId, lastId, limit);
    }

    @Get('followings/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '헤당 유저 팔로잉 목록' })
    async getFollowing(
        @Param('userId', ParseIntPipe) userId: string,
        @Query('lastId') lastId?: number,
        @Query('limit') limit?: number,
    ) {
        return this.userFollowService.findFollowings(userId, lastId, limit);
    }

    @Get('count/followings/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로잉 수' })
    async getCountsFollowers(
        @Param('userId', ParseIntPipe) userId: string, 
    ) {
        return await this.userFollowService.findCountFollowOrFollower(userId, true);
    }

    @Get('count/followers/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로워 수 (팔로워의 경우 9999 넘어가면 +9999로 표시해주세요 => 팔로잉 목록에서 팔로잉 유저의 팔로워 수 표기 용)' })
    async getCountsFollowings(
        @Param('userId', ParseIntPipe) userId: string, 
    ) {
        return await this.userFollowService.findCountFollowOrFollower(userId, false);
    }
}
