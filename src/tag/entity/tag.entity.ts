import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Tag extends BaseEntity {
    @Column({ type: 'varchar', length: 30, comment: '태그 이름', unique: true })
    name: string;

    @Column({ type: 'boolean', comment: '푸드 카테고리 여부', default: false })
    isFood: boolean;

    @Column({ type: 'boolean', comment: '생활 카테고리 여부', default: false })
    isLifestyle: boolean;

    @Column({ type: 'boolean', comment: '패션 카테고리 여부', default: false })
    isFashion: boolean;

    @Column({ type: 'boolean', comment: '뷰티 카테고리 여부', default: false })
    isBeauty: boolean;

    @Column({ type: 'boolean', comment: '헬스 카테고리 여부', default: false })
    isHealth: boolean;

    @Column({ type: 'boolean', comment: '테크 카테고리 여부', default: false })
    isTech: boolean;

    @Column({ type: 'boolean', comment: '인테리어 카테고리 여부', default: false })
    isInterior: boolean;

    @Column({ type: 'boolean', comment: '여행 카테고리 여부', default: false })
    isTravel: boolean;

    @Column({ type: 'boolean', comment: '취미/레저 카테고리 여부', default: false })
    isHobbyLeisure: boolean;

    @Column({ type: 'boolean', comment: '키즈 카테고리 여부', default: false })
    isKids: boolean;

    @Column({ type: 'boolean', comment: '펫 카테고리 여부', default: false })
    isPet: boolean;

    @Column({ type: 'boolean', comment: '자동차 카테고리 여부', default: false })
    isCar: boolean;
    
    @Column({ type: 'boolean', comment: '주방 카테고리 여부', default: false })
    isKitchen: boolean;

    @Column({ type: 'boolean', comment: '가게 태그 여부', default: false })
    isStoreTag: boolean;

    @Column({ type: 'boolean', comment: '리뷰 태그 여부', default: false })
    isReviewTag: boolean;

    @Column({ type: 'boolean', comment: '상품 태그 여부', default: false })
    isProductTag: boolean;


}