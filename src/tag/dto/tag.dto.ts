import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "../entity/tag.entity";

export class TagDto {
    @ApiProperty({ description: '태그 ID', example: 1 })
    id: number;

    @ApiProperty({ description: '태그 이름' , example: '태그1'})
    name: string;

    @ApiProperty({ description: '푸드 카테고리 여부', example: true })
    isFood: boolean;

    @ApiProperty({ description: '생활 카테고리 여부', example: false })
    isLifestyle: boolean;

    @ApiProperty({ description: '패션 카테고리 여부', example: true })
    isFashion: boolean;

    @ApiProperty({ description: '뷰티 카테고리 여부', example: false })
    isBeauty: boolean;

    @ApiProperty({ description: '헬스 카테고리 여부', example: true })
    isHealth: boolean;

    @ApiProperty({ description: '테크 카테고리 여부', example: false })
    isTech: boolean;

    @ApiProperty({ description: '인테리어 카테고리 여부', example: true })
    isInterior: boolean;

    @ApiProperty({ description: '여행 카테고리 여부', example: false })
    isTravel: boolean;

    @ApiProperty({ description: '취미/레저 카테고리 여부', example: true })
    isHobbyLeisure: boolean;

    @ApiProperty({ description: '키즈 카테고리 여부', example: false })
    isKids: boolean;

    @ApiProperty({ description: '펫 카테고리 여부', example: true })
    isPet: boolean;

    @ApiProperty({ description: '자동차 카테고리 여부', example: false })
    isCar: boolean;

    @ApiProperty({ description: '주방 카테고리 여부', example: true })
    isKitchen: boolean;

    @ApiProperty({ description: '가게 태그 여부', example: false })
    isStoreTag: boolean;

    @ApiProperty({ description: '리뷰 태그 여부', example: true })
    isReviewTag: boolean;

    @ApiProperty({ description: '상품 태그 여부', example: false })
    isProductTag: boolean;

    constructor(tag: Tag) {
        this.id = tag.id;
        this.name = tag.name;
        this.isFood = tag.isFood;
        this.isLifestyle = tag.isLifestyle;
        this.isFashion = tag.isFashion;
        this.isBeauty = tag.isBeauty;
        this.isHealth = tag.isHealth;
        this.isTech = tag.isTech;
        this.isInterior = tag.isInterior;
        this.isTravel = tag.isTravel;
        this.isHobbyLeisure = tag.isHobbyLeisure;
        this.isKids = tag.isKids;
        this.isPet = tag.isPet;
        this.isCar = tag.isCar;
        this.isKitchen = tag.isKitchen;
        this.isStoreTag = tag.isStoreTag;
        this.isReviewTag = tag.isReviewTag;
        this.isProductTag = tag.isProductTag;
    }

}