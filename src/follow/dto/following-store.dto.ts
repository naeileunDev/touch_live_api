import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";
import { Store } from "src/store/entity/store.entity";

export class FollowingStoreDto {
    @ApiProperty({ description: '스토어 ID' })
    id: number;
    @ApiProperty({ description: '스토어 이름' })
    name: string;

    //스토어 미디어 관련 기능 추가 후 이미지 추가
    // @ApiProperty({ description: '스토어 이미지' })
    // profileImage: string;

    @ApiProperty({ description: '스토어 메인 태그', isArray: true, example: ['태그1', '태그2', '태그3'] })
    mainTags: string[];

    @ApiProperty({ description: '팔로워 수', example: 9999, required: true })
    @IsInt()
    followersCount: number;

    constructor(store: Store, followersCount: number) {
        this.id = store.id;
        this.name = store.name;
        // this.profileImage = store.storeProfileImageId;
        this.mainTags = store.mainTags;
        this.followersCount = followersCount;
    }
}