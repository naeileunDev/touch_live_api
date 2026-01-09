import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, ValidateNested } from "class-validator";
import { FollowingStoreDto } from "./following-store.dto";

export class StoreFollowsDto {
    @ApiProperty({ description: '팔로워 정보', type: () => StoreFollowsDto, required: true })
    @ValidateNested()
    @Type(() => StoreFollowsDto)
    stores?: StoreFollowsDto[] = [];
    @ApiProperty({ description: '팔로워 수', example: 9999, required: true })
    @IsInt()
    followersCount: number;

    constructor(stores: FollowingStoreDto[] = [], followersCount: number) {
        this.stores = stores;
        this.followersCount = followersCount;
    }
}