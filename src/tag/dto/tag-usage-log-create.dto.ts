import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber } from "class-validator";
import { UsageType } from "../enum/usage-type.enum";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class TagUsageLogCreateDto {

    @ApiProperty({ description: '태그 사용 타입', example: UsageType.Store })
    @IsEnum(UsageType)
    usageType: UsageType;

    @ApiProperty({ description: '태그 사용 콘텐츠 id', example: 1 })
    @IsNumber()
    contentId: number;

    @ApiProperty({ description: '사용된 태그 이름', example: '카페라떼' })
    @IsRequiredString()
    tagName: string;
}