import { ApiProperty } from "@nestjs/swagger";
import { StoreRegisterLogDto } from "./store-register-log.dto";

export class StoreRegisterLogListResponseDto {
    @ApiProperty({ 
        description: '가게 등록 로그 리스트', 
        type: [StoreRegisterLogDto],
        isArray: true 
    })
    logs: StoreRegisterLogDto[];

    @ApiProperty({ 
        description: '전체 개수', 
        example: 10,
        type: Number 
    })
    count: number;

    constructor(logs: StoreRegisterLogDto[], count: number) {
        this.logs = logs;
        this.count = count;
    }
}

