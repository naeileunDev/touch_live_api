import { Injectable } from "@nestjs/common";
import { TagRepository } from "./repository/tag.repository";
import { TagUsageLogRepository } from "./repository/tag-usage-log.repository";
import { TagCreateDto } from "./dto/tag-create.dto";
import { TagDto } from "./dto/tag.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { TagFindDto } from "./dto/tag-find.dto";
import { TagFindResponseDto } from "./dto/tag-find-response.dto";
import { CATEGORY_FIELD_MAP, CategoryType } from "./enum/category-type.enum";
import { USAGE_FIELD_MAP, UsageType } from "./enum/usage-type.enum";
import { TagFindCategoryDto } from "./dto/tag-find-category.dto";
import { Tag } from "./entity/tag.entity";

@Injectable()
export class TagService {
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly tagUsageLogRepository: TagUsageLogRepository,
    ) {
    }

    async createTag(tagCreateDto: TagCreateDto): Promise<TagDto> {
        if (await this.existsByTagName(tagCreateDto.name)) { 
            throw new ServiceException(MESSAGE_CODE.TAG_NAME_ALREADY_EXISTS);
        }
        const tag = await this.tagRepository.createTag(tagCreateDto);
        return new TagDto(tag);
    }

    async existsByTagName(name: string): Promise<boolean> {
        return await this.tagRepository.existsByTagName(name);
    }

    async findTagList(tagFindDto: TagFindDto): Promise<TagDto[]> {
        const { category, usage } = tagFindDto;
        const tags = await this.tagRepository.findTagList(category, usage);
        return tags.map(tag => new TagDto(tag));
    }
    async findTagListGroupedByUsage(tagFindDto: TagFindDto): Promise<TagFindResponseDto[]> {
        const { category, usage } = tagFindDto;
        console.log("category", category)
        console.log("usage", usage)
        const tags = await this.tagRepository.findTagList(category, usage);
        for (const tag of tags) {
            console.log("tag", tag)
        }
        // 사용처별로 그룹화
        const grouped = new Map<UsageType, Map<CategoryType, string[]>>();
        
        tags.forEach(tag => {
            // ✅ Entity의 boolean 필드 직접 체크
            Object.entries(USAGE_FIELD_MAP).forEach(([usageType, usageFieldName]) => {
                if (tag[usageFieldName as keyof Tag] && tagFindDto.usage.includes(usageType as UsageType)) {
                    const uType = usageType as UsageType;
                    
                    Object.entries(CATEGORY_FIELD_MAP).forEach(([categoryType, categoryFieldName]) => {
                        if (tag[categoryFieldName as keyof Tag] && tagFindDto.category.includes(categoryType as CategoryType)) {
                            const cType = categoryType as CategoryType;
                            
                            if (!grouped.has(uType)) {
                                grouped.set(uType, new Map());
                            }
                            const categoryMap = grouped.get(uType)!;
                            
                            if (!categoryMap.has(cType) && tag) {
                                categoryMap.set(cType, []);
                            }
                            
                            const tagList = categoryMap.get(cType)!;
                            if (!tagList.includes(tag.name)) {
                                tagList.push(tag.name);
                            }
                        }
                    });
                }
            });
        });
        
        // TagFindResponseDto 배열로 변환
        return Array.from(grouped.entries()).map(([usageType, categoryMap]) => ({
            usage: usageType,
            tagFindCategoryDtoList: Array.from(categoryMap.entries()).map(([categoryType, tagList]) => ({
                category: categoryType,
                tagList
            }))
        }));
    }
}