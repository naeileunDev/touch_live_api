import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, TreeRepository } from 'typeorm';
import { ProductCategory } from '../entity/product-category.entity';
import { ProductCategoryCreateDto } from '../dto/product-category-create.dto';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';

@Injectable()
export class ProductCategoryRepository extends TreeRepository<ProductCategory> {
    constructor(private dataSource: DataSource) {
        super(ProductCategory, dataSource.createEntityManager());
    }

    async createCategory(dto: ProductCategoryCreateDto): Promise<ProductCategory> {
        const category = this.create(dto);
        await this.save(category);
        return category;
    }

    async findAll(isUser: boolean): Promise<ProductCategory[]> {
        const queryBuilder =  this.createQueryBuilder('product_category')
            .leftJoinAndSelect('product_category.subCategories', 'children') // 자식 노드 조회
            .leftJoinAndSelect('product_category.upperCategory', 'upperCategory') // 부모 노드 조회 
            .where('product_category.upperCategory IS NULL') // 최상위 카테고리만 조회
            .orderBy('product_category.order', 'ASC') // 상위 카테고리 순서 정렬
            .addOrderBy('children.order', 'ASC'); // 하위 카테고리 순서 정렬

          if(isUser) {
            // 상위 카테고리는 하위 카테고리가 있을 경우에만 조회
            queryBuilder.andWhere('children.id IS NOT NULL');
          }

        const categories = await queryBuilder.getMany();
        
        // 하위 카테고리도 order 기준으로 정렬 (관계 로딩 후 추가 정렬)
        categories.forEach(category => {
            if (category.subCategories && category.subCategories.length > 0) {
                category.subCategories.sort((a, b) => a.order - b.order);
            }
        });

        return categories;
    }

    async findById(id: number): Promise<ProductCategory> {
        const category = await this.findOne({
            where: { id },
            relations: {
                upperCategory: true,
                subCategories: true,
            }
        });

        if (!category) {
            throw new ServiceException(MESSAGE_CODE.PRODUCT_CATEGORY_NOT_FOUND);
        }

        return category;
    }

    async findByIdAndUpperCategoryId(id: number, upperCategoryId: number): Promise<ProductCategory> {
        const category = await this.findOne({
            where: { 
                id, 
                upperCategory: { 
                    id: upperCategoryId 
                },
            },
            relations: {
                upperCategory: true,
            }
        });

        if (!category) {
            throw new ServiceException(MESSAGE_CODE.PRODUCT_CATEGORY_NOT_FOUND);
        }

        return category;

    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected === 0 ? false : true;
    }

    async countById(id: number): Promise<number> {
        return await this.count({
            where: {
                id,
            }
        });
    }

    /**
     * 같은 상위 카테고리를 가진 카테고리들의 최대 order 값 조회
     * @param upperCategoryId - 상위 카테고리 ID (null이면 최상위 카테고리)
     */
    async findMaxOrderByUpperCategoryId(upperCategoryId: number | null): Promise<number> {
        const queryBuilder = this.createQueryBuilder('product_category')
            .select('MAX(product_category.order)', 'maxOrder');

        if (upperCategoryId === null) {
            queryBuilder.where('product_category.upperCategory IS NULL');
        } else {
            queryBuilder
                .leftJoin('product_category.upperCategory', 'upperCategory')
                .where('upperCategory.id = :upperCategoryId', { upperCategoryId });
        }

        const result = await queryBuilder.getRawOne();
        return result?.maxOrder ?? -1; // 값이 없으면 -1 반환 (다음 순서는 0)
    }
}
