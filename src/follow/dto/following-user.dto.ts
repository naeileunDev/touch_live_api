import { ApiProperty } from "@nestjs/swagger";
import { UserTrialRank } from "src/user/enum/user-trial-rank.enum";
import { UserFollow } from "../entity/user-follow.entity";
import { UserRank } from "src/user/enum/user-rank.enum";

export class FollowingUserDto {
    @ApiProperty({ description: '유저 ID' })
    id: number;
    @ApiProperty({ description: '유저 닉네임' })
    nickname: string;
    @ApiProperty({ description: '유저 칭호', example: '월세수익 건물주! 외교관형 레드' })
    title: string;
    @ApiProperty({ description: '유저 프로필 이미지', example: 'https://example.com/profile.jpg' })
    profileImage: string;
    @ApiProperty({ description: '팔로워 총 수, 9999 넘어가면 +9999로 표시해주세요', example: 99 })
    followersCount: number;
    @ApiProperty({ description: '트라이 등급', example: UserTrialRank.Normal })
    trialRank: UserTrialRank;


    constructor(userFollow: UserFollow, followersCount: number) {
        this.id = userFollow.follower.id;
        this.nickname = userFollow.follower.nickname;
        this.title = FollowingUserDto.mappingTitle(userFollow.follower.rank);
        this.profileImage = userFollow.follower.profileImage;
        this.followersCount = followersCount;
        this.trialRank = userFollow.follower.trialRank;
    }

    static mappingTitle(rank: UserRank): string {
        switch (rank) {
            case UserRank.Red:
                return '월세수익 건물주! 외교관형 레드';
            case UserRank.Diamond:
                return '돈이 따라온다! 분석가형 다이아';
            case UserRank.Gold:
                return '월세도 받는! 관리자형 골드';
            case UserRank.Silver:
                return 'n잡러 시대! 탐험가형 실버';
        }
    }
}