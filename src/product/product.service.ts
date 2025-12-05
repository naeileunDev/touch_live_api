import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./repository/product.respository";

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }
}