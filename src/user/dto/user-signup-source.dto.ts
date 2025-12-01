import { ApiProperty } from "@nestjs/swagger";
import { UserSignupSourceCategory } from "../enum/user-signup-source-category.enum";
import { IsEnum, IsOptional, IsString, Length } from "class-validator";

export class UserSignupSourceDto {
    @ApiProperty({ description: '유입경로 카테고리', example: UserSignupSourceCategory.Acquaintance })
    @IsEnum(UserSignupSourceCategory)
    category: UserSignupSourceCategory;

    @ApiProperty({ description: '유입경로 기타 설명', example: '기타 설명', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 255, { message: '유입경로 기타 설명은 1자 이상 255자 이하여야 합니다.' })
    etcDescription?: string;
}