import { Injectable } from "@nestjs/common";
import { TagRepository } from "./repository/tag.repository";
import { TagUsageLogRepository } from "./repository/tag-usage-log.repository";
import { TagCreateDto } from "./dto/tag-create.dto";
import { TagDto } from "./dto/tag.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { TagFindDto } from "./dto/tag-find.dto";
import { CATEGORY_FIELD_MAP, CategoryType } from "./enum/category-type.enum";
import { USAGE_FIELD_MAP, UsageType } from "./enum/usage-type.enum";
import { Tag } from "./entity/tag.entity";
import { TagFindResponseDto } from "./dto/tag-find-response.dto";
import { TagCommonDto } from "./dto/tag-common.dto";

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
        const tags = await this.tagRepository.findTagList(category, usage);
        
        // 필터링할 usage와 category 결정
        const targetUsages = usage?.length ? usage : Object.values(UsageType);
        const targetCategories = category?.length ? category : Object.values(CategoryType);
        
        const grouped = new Map<UsageType, Map<CategoryType, TagCommonDto[]>>();
        
        tags.forEach(tag => {
            Object.entries(USAGE_FIELD_MAP).forEach(([usageType, usageFieldName]) => {
                const uType = usageType as UsageType;
                
                if (tag[usageFieldName as keyof Tag] && targetUsages.includes(uType)) {
                    Object.entries(CATEGORY_FIELD_MAP).forEach(([categoryType, categoryFieldName]) => {
                        const cType = categoryType as CategoryType;
                        
                        if (tag[categoryFieldName as keyof Tag] && targetCategories.includes(cType)) {
                            if (!grouped.has(uType)) {
                                grouped.set(uType, new Map());
                            }
                            const categoryMap = grouped.get(uType)!;
                            
                            if (!categoryMap.has(cType)) {
                                categoryMap.set(cType, []);
                            }
                            
                            const tagList = categoryMap.get(cType)!;
                            if (!tagList.some(t => t.id === tag.id)) {
                                tagList.push(tag);
                            }
                        }
                    });
                }
            });
        });
        
        return Array.from(grouped.entries()).map(([usageType, categoryMap]) => ({
            usage: usageType,
            tagList: Array.from(categoryMap.entries()).map(([categoryType, tagList]) => ({
                category: categoryType,
                tagList: tagList.map(tag => { 
                    return new TagCommonDto(new TagDto(tag as Tag));
                })
            }))
        }));
    }

    async findByIds(ids: number[]): Promise<TagDto[]> {
        const tags = await this.tagRepository.findByIds(ids);
        return tags.map(tag => new TagDto(tag));
    }
}