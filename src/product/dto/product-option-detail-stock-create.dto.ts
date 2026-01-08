import { ProductOptionDetail } from "../entity/product-option-detail.entity";

export class ProductOptionDetailStockCreateDto {
    stock: number;

    productOptionDetail: ProductOptionDetail;
}