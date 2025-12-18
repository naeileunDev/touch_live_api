export enum UsageType {
    // 키워드 사용 타입 - 가게, 상품, 리퓨 
    Store = 'STORE',
    Product = 'PRODUCT',
    Review = 'REVIEW',
}

export const USAGE_FIELD_MAP: Record<UsageType, string> = {
    [UsageType.Store]: 'isStoreTag',
    [UsageType.Product]: 'isProductTag',
    [UsageType.Review]: 'isReviewTag',
} as const;
