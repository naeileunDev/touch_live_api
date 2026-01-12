import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, ValidateNested } from "class-validator";
import { FollowingStoreDto } from "./following-store.dto";

export class StoreFollowsDto {
    @ApiProperty({ description: '팔로잉 스토어 정보', type: () => FollowingStoreDto, isArray: true, required: true })
    @ValidateNested({ each: true })
    @Type(() => FollowingStoreDto)
    stores?: FollowingStoreDto[] = [];

    @ApiProperty({ description: '전체 팔로잉 수', example: 9999, required: true })
    @IsInt()
    total: number;

    constructor(stores: FollowingStoreDto[] = [], total: number) {
        this.stores = stores;
        this.total = total;
    }
}