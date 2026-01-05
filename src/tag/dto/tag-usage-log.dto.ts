import { ApiProperty } from "@nestjs/swagger";
import { TagUsageLog } from "../entities/tag-usage-log.entity";
import { UsageType } from "../enum/usage-type.enum";
import { IsDate, IsEnum, IsNumber } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class TagUsageLogDto {
    @ApiProperty({ description: '태그 사용 로그 ID', example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({ description: '태그 사용 타입', example: UsageType.Store })
    @IsEnum(UsageType)
    usageType: UsageType;
    
    @ApiProperty({ description: '태그 사용 콘텐츠 ID', example: 1 })
    @IsNumber()
    contentId: number;

    @ApiProperty({ description: '사용된 태그 이름', example: '카페라떼' })
    @IsRequiredString()
    tagName: string;

    @ApiProperty({ description: '태그 사용 로그 생성 일시', example: '2025-01-01 12:00:00' })
    @IsDate()
    createdAt: Date;
    
    @ApiProperty({ description: '태그 사용 로그 수정 일시', example: '2025-01-01 12:00:00' })
    @IsDate()
    updatedAt: Date;

    constructor(tagUsageLog: TagUsageLog) {
        this.id = tagUsageLog.id;
        this.usageType = tagUsageLog.usageType;
        this.contentId = tagUsageLog.contentId;
        this.tagName = tagUsageLog.tagName;
        this.createdAt = tagUsageLog.createdAt;
        this.updatedAt = tagUsageLog.updatedAt;
    }
}