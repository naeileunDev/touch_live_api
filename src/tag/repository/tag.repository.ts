import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Equal, In, Repository } from "typeorm";
import { Tag } from "../entities/tag.entity";
import { TagCreateDto } from "../dto/tag-create.dto";
import { CATEGORY_FIELD_MAP, CategoryType } from "../enum/category-type.enum";
import { USAGE_FIELD_MAP, UsageType } from "../enum/usage-type.enum";

@Injectable()
export class TagRepository extends Repository<Tag> {
    constructor(private dataSource: DataSource) {
        super(Tag, dataSource.createEntityManager());
    }

    async createTag(createDto: TagCreateDto): Promise<Tag> {
        const tag = this.create(createDto);
        return await this.save(tag);
    }

    async findById(id: number): Promise<Tag> {
        return await this.findOne({
            where: {
                id
            },
        });
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }
    
    async existsByTagName(name: string): Promise<boolean> {
        return await this.exists({
            where: {
                name
            },
        });
    }

    async findTagList(categories: CategoryType[], usages: UsageType[]): Promise<Tag[]> {
        const queryBuilder = this.createQueryBuilder('tag');
        // 용도 조건 (OR) - 먼저 필터링
        if (usages?.length) {
            queryBuilder.andWhere(
                (qb => {
                    usages.forEach((usage, index) => {
                        const fieldName = USAGE_FIELD_MAP[usage];
                        if (index === 0) {
                            qb.where(`tag.${fieldName} = true`);
                        } else {
                            qb.orWhere(`tag.${fieldName} = true`);
                        }
                    });
                })
            );
        }

        // 카테고리 조건 (OR) - 용도 필터 결과에 추가 조건
        if (categories?.length) {
            queryBuilder.andWhere(
                (qb => {
                    categories.forEach((cat, index) => {
                        const fieldName = CATEGORY_FIELD_MAP[cat];
                        if (index === 0) {
                            qb.where(`tag.${fieldName} = true`);
                        } else {
                            qb.orWhere(`tag.${fieldName} = true`);
                        }
                    });
                })
            );
        }
        return await queryBuilder.getMany();
    }

    async findByIds(ids: number[]): Promise<Tag[]> {
        return await this.find({
            where: {
                id: In(ids),
            },
        });
    }

    async findByTagName(name: string): Promise<Tag> {
        return await this.findOne({
            where: {
                name
            },
        });
    }
}