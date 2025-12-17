import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserSignupSourceCategory } from "../enum/user-signup-source-category.enum";
import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class UserSignupSourceDto {
    @ApiProperty({ description: '유입경로 카테고리', example: UserSignupSourceCategory.Acquaintance, enum: UserSignupSourceCategory })
    @IsEnum(UserSignupSourceCategory)
    category: UserSignupSourceCategory;

    @ApiPropertyOptional({ description: '유입경로 기타 설명', example: '기타 설명' })
    @IsOptional()
    @IsRequiredString()
    @Length(1, 255, { message: '유입경로 기타 설명은 1자 이상 255자 이하여야 합니다.' })
    etcDescription?: string;
}