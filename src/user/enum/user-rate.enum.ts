export enum UserRate {
    //이전 6개월 간 5,000,000원 미만 구매한 유저
    Red = 'RED',
    //이전 6개월 간 1,000,000원 이상 구매한 유저
    Diamond = 'DIAMOND',
    //이전 6개월 간 500,000원 이상 구매한 유저 
    Gold = 'GOLD',
    //일반 유저 
    Silver = 'SILVER',
}