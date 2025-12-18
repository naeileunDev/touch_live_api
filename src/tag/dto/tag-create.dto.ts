import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";
import { IsRequiredString } from "src/common/validator/is-required-string";

export class TagCreateDto {
    @ApiProperty({ description: '태그 이름', example: '태그1' })
    @IsRequiredString()
    name: string;

    @ApiProperty({ description: '푸드 카테고리 여부', example: true })
    @IsBoolean()
    isFood: boolean;

    @ApiProperty({ description: '생활 카테고리 여부', example: false })
    @IsBoolean()
    isLifestyle: boolean;

    @ApiProperty({ description: '패션 카테고리 여부', example: true })
    @IsBoolean()
    isFashion: boolean;

    @ApiProperty({ description: '뷰티 카테고리 여부', example: false })
    @IsBoolean()
    isBeauty: boolean;

    @ApiProperty({ description: '헬스 카테고리 여부', example: true })
    @IsBoolean()
    isHealth: boolean;

    @ApiProperty({ description: '테크 카테고리 여부', example: false })
    @IsBoolean()
    isTech: boolean;

    @ApiProperty({ description: '인테리어 카테고리 여부', example: true })
    @IsBoolean()
    isInterior: boolean;

    @ApiProperty({ description: '여행 카테고리 여부', example: false })
    @IsBoolean()
    isTravel: boolean;

    @ApiProperty({ description: '취미/레저 카테고리 여부', example: true })
    @IsBoolean()
    isHobbyLeisure: boolean;

    @ApiProperty({ description: '키즈 카테고리 여부', example: false })
    @IsBoolean()
    isKids: boolean;

    @ApiProperty({ description: '펫 카테고리 여부', example: true })
    @IsBoolean()
    isPet: boolean;

    @ApiProperty({ description: '자동차 카테고리 여부', example: false })
    @IsBoolean()
    isCar: boolean;

    @ApiProperty({ description: '주방 카테고리 여부', example: true })
    @IsBoolean()
    isKitchen: boolean; 

    @ApiProperty({ description: '가게 태그 여부', example: false })
    @IsBoolean()
    isStoreTag: boolean;

    @ApiProperty({ description: '리뷰 태그 여부', example: true })
    @IsBoolean()
    isReviewTag: boolean;

    @ApiProperty({ description: '상품 태그 여부', example: false })
    @IsBoolean()
    isProductTag: boolean;
}