export enum CategoryType {
    Public = 'PUBLIC',           // 공용
    Food = 'FOOD',               // 푸드
    Lifestyle = 'LIFESTYLE',     // 생활
    Fashion = 'FASHION',         // 패션
    Beauty = 'BEAUTY',           // 뷰티
    Health = 'HEALTH',           // 헬스
    Tech = 'TECH',               // 테크
    Interior = 'INTERIOR',       // 인테리어
    Travel = 'TRAVEL',           // 여행
    HobbyLeisure = 'HOBBY_LEISURE', // 취미/레저
    Kids = 'KIDS',               // 키즈
    Pet = 'PET',                 // 펫
    Car = 'CAR',                 // 자동차
    Total = 'TOTAL',             // 전체
}

export const SPECIFIC_CATEGORIES = [
    CategoryType.Food,
    CategoryType.Lifestyle,
    CategoryType.Fashion,
    CategoryType.Beauty,
    CategoryType.Health,
    CategoryType.Tech,
    CategoryType.Interior,
    CategoryType.Travel,
    CategoryType.HobbyLeisure,
    CategoryType.Kids,
    CategoryType.Pet,
    CategoryType.Car
];