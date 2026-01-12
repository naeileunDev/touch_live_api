import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { FollowingUserDto } from './following-user.dto';
import { Type } from 'class-transformer';

// 팔로잉 목록 조회 응답 DTO 리스트의 타입
export class UserFollowsDto {
    @ApiProperty({ description: '팔로잉 유저 정보', type: () => FollowingUserDto, isArray: true, required: true })
    @ValidateNested({ each: true })
    @Type(() => FollowingUserDto)
    livers?: FollowingUserDto[] = [];
    
    @ApiProperty({ description: '전체 팔로잉 수', example: 9999, required: true })
    @IsInt()
    total: number;

    constructor(livers: FollowingUserDto[] = [], total: number) {
        this.livers = livers;
        this.total = total;
    }
}
