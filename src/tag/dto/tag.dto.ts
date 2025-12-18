import { ApiProperty } from "@nestjs/swagger";

export class TagDto {
    @ApiProperty({ description: '태그 이름' })
    name: string;

    @ApiProperty({ description: '푸드 카테고리 여부' })
    isFood: boolean;

    @ApiProperty({ description: '생활 카테고리 여부' })
    isLifestyle: boolean;

    @ApiProperty({ description: '패션 카테고리 여부' })
    isFashion: boolean;

    @ApiProperty({ description: '뷰티 카테고리 여부' })
    isBeauty: boolean;

    @ApiProperty({ description: '헬스 카테고리 여부' })
    isHealth: boolean;

    @ApiProperty({ description: '테크 카테고리 여부' })
    isTech: boolean;

    @ApiProperty({ description: '인테리어 카테고리 여부' })
    isInterior: boolean;

    @ApiProperty({ description: '여행 카테고리 여부' })
    isTravel: boolean;

    @ApiProperty({ description: '취미/레저 카테고리 여부' })
    isHobbyLeisure: boolean;

    @ApiProperty({ description: '키즈 카테고리 여부' })
    isKids: boolean;

    @ApiProperty({ description: '펫 카테고리 여부' })
    isPet: boolean;

    @ApiProperty({ description: '자동차 카테고리 여부' })
    isCar: boolean;

    @ApiProperty({ description: '주방 카테고리 여부' })
    isKitchen: boolean;

    @ApiProperty({ description: '가게 태그 여부' })
    isStoreTag: boolean;

    @ApiProperty({ description: '리뷰 태그 여부' })
    isReviewTag: boolean;

    @ApiProperty({ description: '상품 태그 여부' })
    isProductTag: boolean;
}