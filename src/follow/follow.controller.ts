import { Controller, Get, Post, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) {}

    @Post(':userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '팔로우/언팔로우 토글' })
    async toggle(
        @GetUser('id') followerId: number,
        @Param('userId', ParseIntPipe) followingId: number,
    ) {
        return this.followService.follow(followerId, followingId);
    }

    @Get('check/:userId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '팔로우 여부 확인' })
    async checkFollowing(
        @GetUser('id') followerId: number,
        @Param('userId', ParseIntPipe) followingId: number,
    ) {
        const isFollowing = await this.followService.isFollowing(followerId, followingId);
        return { isFollowing };
    }

    @Get('followers/:userId')
    @ApiOperation({ summary: '팔로워 목록' })
    async getFollowers(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.followService.getFollowers(userId, page, limit);
    }

    @Get('following/:userId')
    @ApiOperation({ summary: '팔로잉 목록' })
    async getFollowing(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.followService.getFollowing(userId, page, limit);
    }

    @Get('count/:userId')
    @ApiOperation({ summary: '팔로워/팔로잉 수' })
    async getCounts(@Param('userId', ParseIntPipe) userId: number) {
        const [followers, following] = await Promise.all([
            this.followService.getFollowerCount(userId),
            this.followService.getFollowingCount(userId),
        ]);
        return { followers, following };
    }
}
