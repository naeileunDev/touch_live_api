import { Injectable } from "@nestjs/common";
import { Keyword } from "../entity/keyword.entity";
import { DataSource, In, Repository } from "typeorm";
import { UsageType } from "../enum/usage-type.enum";
import { CategoryType, SPECIFIC_CATEGORIES } from "../enum/category-type.enum";
import { KeywordFindResponseDto } from "../dto/keyword-find-response.dto";

@Injectable()
export class KeywordRepository extends Repository<Keyword> {
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(Keyword, dataSource.createEntityManager());
    }

    async findAllByUsageAndCategory(usage: UsageType, category: CategoryType): Promise<KeywordFindResponseDto> {
        let categoryFilter: CategoryType[] = [];        
        if (category === CategoryType.Total) {
            categoryFilter = [...SPECIFIC_CATEGORIES, CategoryType.Public];
        } else {
            categoryFilter = [category, CategoryType.Public];
        }
        const [keywords, total] = await this.findAndCount({
            where: {
                usage,
                category: In(categoryFilter),
            },
        });
        const response = new KeywordFindResponseDto();
        Object.assign(response, {
            name: keywords.map(keyword => keyword.name),
            usage,
            category: [category],
            total,
        });
        return response;
    }
}