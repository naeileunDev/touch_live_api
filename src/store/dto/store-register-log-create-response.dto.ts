import { ApiProperty } from "@nestjs/swagger";
import { StoreRegisterLogDto } from "./store-register-log.dto";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { AuthTokenDto } from "src/auth/dto/auth-token.dto";
import { StoreFilesDto } from "./store-files.dto";
import { StoreRegisterLog } from "../entities/store-register-log.entity";

export class StoreRegisterLogCreateResponseDto {
    @ApiProperty({ description: '가게 등록 로그 정보', type: StoreRegisterLogDto })
    @ValidateNested()
    @Type(() => StoreRegisterLogDto)
    storeRegisterLogDto: StoreRegisterLogDto;

    @ApiProperty({ description: '가게 파일 정보', type: StoreFilesDto })
    @ValidateNested()
    @Type(() => StoreFilesDto)
    files: StoreFilesDto;

    @ApiProperty({ description: '토큰 정보', type: AuthTokenDto })
    @ValidateNested()
    @Type(()=>AuthTokenDto)
    token: AuthTokenDto;

    constructor(storeRegisterLog: StoreRegisterLog, storeFilesDto: StoreFilesDto, token: AuthTokenDto) {
        this.storeRegisterLogDto = new StoreRegisterLogDto(storeRegisterLog);
        this.files = storeFilesDto;
        this.token = token;
    }
}