import { Controller, Get, Post, Param, Query, ParseIntPipe, Body, ParseArrayPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiExtraModels, ApiBody } from '@nestjs/swagger';
import { UserFollowService } from './service/user-follow.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ALL_PERMISSION, ANY_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { Role } from 'src/common/decorator/role.decorator';
import { UserDto } from 'src/user/dto';
import { ApiOkSuccessResponse } from 'src/common/decorator/swagger/api-response.decorator';
import { UserFollowsDto } from './dto/user-follows.dto';
import { FollowingUserDto } from './dto/following-user.dto';
import { StoreFollowService } from './service/store-follow.service';
import { StoreFollowsDto } from './dto/store-follows.dto';
import { FollowingStoreDto } from './dto/following-store.dto';

@ApiTags('Follow')
@Controller('follow')
@ApiBearerAuth('access-token')
export class FollowController {
    constructor(
        private readonly userFollowService: UserFollowService,
        private readonly storeFollowService: StoreFollowService,
    ) {}

    @Get('user/check/:userId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로우 여부 확인' })
    @ApiOkSuccessResponse(Boolean, '팔로우 여부 확인 성공')
    checkUserFollowing(
        @GetUser() userDto: UserDto,
        @Param('userId') followingId: string,
    ): Promise<boolean> {
        return this.userFollowService.isFollowing(userDto.id, followingId);
    }

    @Post('user/:userId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '팔로우/언팔로우 토글 (해당 유저 팔로우/언팔로우)' })
    @ApiOkSuccessResponse(Boolean, '팔로우/언팔로우 토글 성공')
    toggleFollow(@GetUser() userDto: UserDto, @Param('userId') userId: string): Promise<boolean> {
        return this.userFollowService.followAndUnfollow(userDto.id, userId);
    }

    @Get('user/followings/:userId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 유저 팔로잉 목록 (무한 스크롤 용, 7개씩 조회 가능, liver의 팔로워 수는 followersCount에 표기됩니다. 9999 넘어가면 +9999로 표시해주세요)' })
    @ApiExtraModels(FollowingUserDto)
    @ApiOkSuccessResponse(UserFollowsDto, '해당 유저 팔로잉 목록 조회 성공')
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
    @ApiExtraModels(FollowingUserDto)
    getCountFollowers(
        @Param('userId', ParseIntPipe) userId: string, 
    ): Promise<number> {
        return this.userFollowService.findCountFollowOrFollower(userId, false);
    }

    @Post('user/unfollow/users')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '팔로잉 목록에서 팔로잉 유저 언팔로우(팔로잉 유저 ID 배열)' })
    @ApiBody({
        schema: {
            type: 'array',
            items: {
                type: 'number'
            },
            example: [1, 2, 3]
        }
    })
    @ApiOkSuccessResponse(Boolean, '팔로잉 목록에서 팔로잉 유저 언팔로우 성공')
    unfollowLivers(
        @GetUser() userDto: UserDto, 
        @Body(new ParseArrayPipe({ items: Number })) livers: number[]
    ): Promise<boolean> {
        return this.userFollowService.unfollow(userDto.id, livers);
    }

    @Get('store/check/:storeId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '해당 스토어 팔로우 여부 확인' })
    @ApiOkSuccessResponse(Boolean, '팔로우 여부 확인 성공')
    checkStoreFollowing(
        @GetUser() userDto: UserDto,
        @Param('storeId', ParseIntPipe) storeId: number,
    ): Promise<boolean> {
        return this.storeFollowService.isFollowing(userDto.id, storeId);
    }

    @Post('store/:storeId')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '유저가 해당 스토어를 팔로우/언팔로우 토글' })
    @ApiOkSuccessResponse(Boolean, '유저가 해당 스토어를 팔로우/언팔로우 토글 성공')
    toggleStoreFollow(@GetUser() userDto: UserDto, @Param('storeId') storeId: number): Promise<boolean> {
        return this.storeFollowService.followAndUnfollow(userDto.id, storeId);
    }

    @Get('store/followings/:publicId')
    @Role(ALL_PERMISSION)
    @ApiExtraModels(FollowingStoreDto)
    @ApiOperation({ summary: '해당 유저의 스토어 팔로잉 목록 (무한 스크롤 용, 7개씩 조회 가능, store의 팔로워 수는 followersCount에 표기됩니다. 9999 넘어가면 +9999로 표시해주세요)' })
    @ApiOkSuccessResponse(StoreFollowsDto, '해당 유저의 스토어 팔로잉 목록 조회 성공', true)
    getStoreFollowings(
        @Param('publicId') publicId: string,
        @Query('lastId') lastId?: number,
    ): Promise<StoreFollowsDto> {
        return this.storeFollowService.findFollowingStoresFollowerCounts(publicId, lastId, 7);
    }

    @Get('store/count/followers/:storeId')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '해당 스토어 팔로워 수 (팔로워의 경우 9999 넘어가면 +9999로 표시해주세요 => 팔로잉 스토어의 팔로워 수 표기 용)' })
    @ApiOkSuccessResponse(Number, '해당 스토어 팔로워 수 조회 성공')
    getCountStoreFollowers(
        @Param('storeId') storeId: number, 
    ): Promise<number> {
        return this.storeFollowService.findCountFollowers(storeId);
    }

    @Post('store/unfollow/stores')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '유저가 팔로잉 목록에서 팔로잉 스토어 언팔로우(팔로잉 스토어 ID 배열)' })
    @ApiBody({
        schema: {
            type: 'array',
            items: {
                type: 'number'
            },
            example: [1, 2, 3]
        }
    })
    @ApiOkSuccessResponse(Boolean, '유저가 팔로잉 목록에서 팔로잉 스토어 언팔로우 성공')
    unfollowStores(
        @GetUser() userDto: UserDto, 
        @Body(new ParseArrayPipe({ items: Number })) stores: number[]
    ): Promise<boolean> {
        return this.storeFollowService.unfollow(userDto.id, stores);
    }



}
