import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductCategory } from '../entity/product-category.entity';

export class ProductCategoryCreateDto {
  @ApiProperty({ description: '카테고리 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: '상위 카테고리 ID (없으면 최상위)', nullable: true })
  @IsOptional()
  @IsNumber()
  upperId?: number;

  upperCategory: ProductCategory;
  
  order: number;
}
