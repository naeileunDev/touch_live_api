export enum OrderProductStatus {
    Pending = 'PENDING',  //장바구니 상태 
    PaymentPending = 'PAYMENT_PENDING',
    PaymentFailed = 'PAYMENT_FAILED',
    Paid = 'PAID',
    Preparing = 'PREPARING',
    Shipped = 'SHIPPED', 
    Delivered = 'DELIVERED',
    ExchangeRequested = 'EXCHANGE_REQUESTED',
    ExchangeApproved = 'EXCHANGE_APPROVED',
    ExchangeCompleted = 'EXCHANGE_COMPLETED',
    RefundRequested = 'REFUND_REQUESTED',
    RefundApproved = 'REFUND_APPROVED',
    RefundCompleted = 'REFUND_COMPLETED',
}