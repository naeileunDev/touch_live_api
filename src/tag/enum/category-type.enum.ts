export enum CategoryType {
    Food = 'FOOD',               // 푸드
    Lifestyle = 'LIFESTYLE',     // 생활
    Fashion = 'FASHION',         // 패션
    Beauty = 'BEAUTY',           // 뷰티
    Health = 'HEALTH',           // 헬스
    Tech = 'TECH',               // 테크
    Interior = 'INTERIOR',       // 인테리어
    Travel = 'TRAVEL',           // 여행
    HobbyLeisure = 'HOBBY_LEISURE', //취미/레저
    Kids = 'KIDS',               // 키즈
    Pet = 'PET',                 // 펫
    Car = 'CAR',                 // 자동차
    Kitchen = 'KITCHEN',         // 주방
}

export const CATEGORY_FIELD_MAP: Record<CategoryType, string> = {
    [CategoryType.Food]: 'isFood',
    [CategoryType.Lifestyle]: 'isLifestyle',
    [CategoryType.Fashion]: 'isFashion',
    [CategoryType.Beauty]: 'isBeauty',
    [CategoryType.Health]: 'isHealth',
    [CategoryType.Tech]: 'isTech',
    [CategoryType.Interior]: 'isInterior',
    [CategoryType.Travel]: 'isTravel',
    [CategoryType.HobbyLeisure]: 'isHobbyLeisure',
    [CategoryType.Kids]: 'isKids',
    [CategoryType.Pet]: 'isPet',
    [CategoryType.Car]: 'isCar',
    [CategoryType.Kitchen]: 'isKitchen',
} as const;

