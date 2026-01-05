import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductOption } from './entities/product-option.entity';
import { ProductRequiredInfo } from './entities/product-required-info.entity';
import { ProductTag } from './entities/product-tag.entity';

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
