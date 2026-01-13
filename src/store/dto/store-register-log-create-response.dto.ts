import { ApiProperty } from "@nestjs/swagger";
import { StoreRegisterLogDto } from "./store-register-log.dto";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { AuthTokenDto } from "src/auth/dto/auth-token.dto";
import { StoreFilesDto } from "./store-files.dto";
import { StoreRegisterLog } from "../entity/store-register-log.entity";
import { StoreRegisterLogFilesDto } from "src/file/dto/store-register-log-files.dto";
import { FileDto } from "src/file/dto/file.dto";

export class StoreRegisterLogCreateResponseDto {
    @ApiProperty({ description: '가게 등록 로그 정보', type: StoreRegisterLogDto })
    @ValidateNested()
    @Type(() => StoreRegisterLogDto)
    storeRegisterLogDto: StoreRegisterLogDto;

    @ApiProperty({ description: '토큰 정보', type: AuthTokenDto })
    @ValidateNested()
    @Type(()=>AuthTokenDto)
    token: AuthTokenDto;

    constructor(storeRegisterLog: StoreRegisterLog, files: FileDto[], token: AuthTokenDto) {
        this.storeRegisterLogDto = new StoreRegisterLogDto(storeRegisterLog, StoreRegisterLogFilesDto.of(files));
        this.token = token;
    }
}