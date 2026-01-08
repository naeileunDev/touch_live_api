import { Product } from "../entity/product.entity";

export class ProductStockCreateDto {
    stock: number;

    product: Product;
}