// 비디오 대상 타입
export enum VideoTargetType {
    ShortForm = 'SHORT_FORM',
    Review = 'REVIEW',
}

// 제품 카테고리 (고정)
export enum ProductCategory {
    Food = 'FOOD',
    Living = 'LIVING',
    Fashion = 'FASHION',
    Beauty = 'BEAUTY',
    Health = 'HEALTH',
    Tech = 'TECH',
    Interior = 'INTERIOR',
    Kitchen = 'KITCHEN',
    Travel = 'TRAVEL',
    Hobby = 'HOBBY',
    Kids = 'KIDS',
    Pet = 'PET',
    Car = 'CAR',
}

// 성별
export enum GenderType {
    Unisex = 'UNISEX',
    Male = 'MALE',
    Female = 'FEMALE',
}

// 연령
export enum AgeType {
    All = 'ALL',
    Kids = 'KIDS',
    Adult = 'ADULT',
}

// 제품 옵션 타입
export enum ProductOptionType {
    Single = 'SINGLE',
    Option = 'OPTION',
}

// 제품 상태
export enum ProductStatus {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    OnSale = 'ON_SALE',
    SoldOut = 'SOLD_OUT',
    Hidden = 'HIDDEN',
}

// 업로드 타입
export enum UploadType {
    Normal = 'NORMAL',
    Instant = 'INSTANT',
}

// 필수 표기 정보 품목
export enum ProductItemType {
    Clothing = 'CLOTHING',
    Shoes = 'SHOES',
    Bag = 'BAG',
    FashionAccessory = 'FASHION_ACCESSORY',
    Bedding = 'BEDDING',
    Furniture = 'FURNITURE',
    Food = 'FOOD',
    Cosmetics = 'COSMETICS',
    Electronics = 'ELECTRONICS',
    Other = 'OTHER',
}

// 검색 타입
export enum SearchType {
    Product = 'PRODUCT',
    Store = 'STORE',
    ShortForm = 'SHORT_FORM',
}

// 배너 링크 타입
export enum BannerLinkType {
    None = 'NONE',
    Product = 'PRODUCT',
    Store = 'STORE',
    ShortForm = 'SHORT_FORM',
    Notice = 'NOTICE',
    External = 'EXTERNAL',
}

// 배너 위치
export enum BannerPosition {
    MainTop = 'MAIN_TOP',
    MainMiddle = 'MAIN_MIDDLE',
    MainBottom = 'MAIN_BOTTOM',
    CategoryTop = 'CATEGORY_TOP',
}

// 심사 상태 
export enum AuditStatus {
    Pending = 'PENDING', // 대기 중 (심사 요청 후 심사 대기 상태)
    Approved = 'APPROVED', // 승인 (심사 결과 승인 상태)
    Rejected = 'REJECTED', // 거절 (심사 결과 거절 상태)
    CompletedRating = 'COMPLETED_RATING', // 평가 완료 (등급심사의 경우 평가 완료 상태)   
}