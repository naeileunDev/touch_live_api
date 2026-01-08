import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserFollowDto {
    nickname: string;
    title: string;
    profileImage: string;
    followerCount: number;
    trialRank: string;
}
