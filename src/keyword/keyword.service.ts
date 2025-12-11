import { Injectable } from "@nestjs/common";
import { KeywordRepository } from "./repository/keyword.repository";
import { KeywordFindDto } from "./dto/keyword-find.dto";
import { Equal, In } from "typeorm";
import { CategoryType } from "./enum/category-type.enum";
import { KeywordFindResponseDto } from "./dto/keyword-find-response.dto";

@Injectable()
export class KeywordService {
    constructor(
        private readonly keywordRepository: KeywordRepository
    ) {
    }

    async getKeywordListWithCount(keywordFindDto: KeywordFindDto): Promise<KeywordFindResponseDto> {
        const { usage, category } = keywordFindDto;
        const response = await this.keywordRepository.findAllByUsageAndCategory(usage, category);
        return response;
    }
}