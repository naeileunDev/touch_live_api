export enum DecisionStatus {
    // 결제 전 null 
    Waiting = 'WAITING', // 결제 후 대기중 
    CompletedBuy = 'COMPLETED_BY_BUYER',  //소비자 구매 완료
    CompletedExchange = 'COMPLETED_EXCHANGE',  //소비자 교환 완료
    CompletedRefund = 'COMPLETED_REFUND',  //소비자 환불 완료
}