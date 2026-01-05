import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { ProductImage } from './entity/product-image.entity';
import { ProductOption } from './entity/product-option.entity';
import { ProductRequiredInfo } from './entity/product-required-info.entity';
import { ProductTag } from './entity/product-tag.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            Product,
            ProductImage,
            ProductOption,
            ProductRequiredInfo,
            ProductTag,
        ]),
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
