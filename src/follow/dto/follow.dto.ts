import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowUserDto {
    @ApiProperty({ description: '팔로우할 사용자 ID' })
    @IsInt()
    userId: number;
}
