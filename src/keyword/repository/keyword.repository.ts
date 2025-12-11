import { Injectable } from "@nestjs/common";
import { Keyword } from "../entity/keyword.entity";
import { DataSource, In, Repository } from "typeorm";
import { UsageType } from "../enum/usage-type.enum";
import { CategoryType } from "../enum/category-type.enum";
import { KeywordFindResponseDto } from "../dto/keyword-find-response.dto";

@Injectable()
export class KeywordRepository extends Repository<Keyword> {
    constructor(
        private readonly dataSource: DataSource
    ) {
        super(Keyword, dataSource.createEntityManager());
    }

    async findAllByUsageAndCategory(usage: UsageType, category: CategoryType): Promise<KeywordFindResponseDto> {
        const [keywords, total] = await this.findAndCount({
            where: {
                usage,
                category: In([category, CategoryType.Public]),
            },
        });
        const response = new KeywordFindResponseDto();
        Object.assign(response, {
            name: keywords.map(keyword => keyword.name),
            usage,
            category: [category, CategoryType.Public],
            total,
        });
        return response;
    }
}