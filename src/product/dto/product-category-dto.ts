import { ApiProperty } from '@nestjs/swagger';
import { ProductCategory } from '../entity/product-category.entity';

export class ProductCategoryDto {
    @ApiProperty({ description: '카테고리 ID' })
    id: number;

    @ApiProperty({ description: '카테고리 이름' })
    name: string;

    @ApiProperty({ description: '순서' })
    order: number;

    @ApiProperty({ description: '하위 카테고리 목록', type: () => [ProductCategoryDto], required: false })
    subCategories?: ProductCategoryDto[];

    @ApiProperty({ description: '사용중인 상품 수' })
    productCount?: number;


    constructor(category: ProductCategory) {
        this.id = category.id;
        this.name = category.name;
        this.order = category.order;
        if (category.subCategories) {
            this.subCategories = category.subCategories.map((c) => new ProductCategoryDto(c));
        }
    }
}
