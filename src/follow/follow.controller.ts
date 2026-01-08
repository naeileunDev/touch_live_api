import { Controller, Get, Post, Param, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ALL_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { Role } from 'src/common/decorator/role.decorator';

@ApiTags('Follow')
@Controller('follow')
@ApiBearerAuth('access-token')
export class FollowController {
    constructor(private readonly followService: FollowService) {}

    @Post(':userId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '팔로우/언팔로우 토글' })
    async toggle(
        @GetUser('id') followerId: number,
        @Param('userId', ParseIntPipe) followingId: number,
    ) {
        return this.followService.followAndUnfollow(followerId, followingId);
    }

    @Get('followers/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로워 목록' })
    async getFollowers(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('lastId') lastId?: number,
        @Query('limit') limit: number = 7,
    ) {
        return this.followService.findFollowers(userId, lastId, limit);
    }

    @Get('followings/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '헤당 유저 팔로잉 목록' })
    async getFollowing(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('lastId') lastId?: number,
        @Query('limit') limit?: number,
    ) {
        return this.followService.findFollowings(userId, lastId, limit);
    }

    @Get('count/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '팔로워/팔로잉 수' })
    async getCounts(
        @Param('userId', ParseIntPipe) userId: number, 
        @Query('isFollowers', ParseBoolPipe) isFollowers: boolean
    ) {
        return await this.followService.findCountFollowOrFollower(userId, isFollowers);
    }
}
