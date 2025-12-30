import { Injectable } from "@nestjs/common";
import { TagRepository } from "./repository/tag.repository";
import { TagCreateDto } from "./dto/tag-create.dto";
import { TagDto } from "./dto/tag.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { TagFindRequestDto } from "./dto/tag-find-request.dto";
import { CATEGORY_FIELD_MAP, CategoryType } from "./enum/category-type.enum";
import { USAGE_FIELD_MAP, UsageType } from "./enum/usage-type.enum";
import { Tag } from "./entity/tag.entity";
import { TagFindDto } from "./dto/tag-find.dto";

@Injectable()
export class TagService {
    constructor(
        private readonly tagRepository: TagRepository,
    ) {
    }
    // create: 새로운 엔티티 생성 및 DTO 반환
    async create(createDto: TagCreateDto): Promise<TagDto> {
        if (await this.existsByTagName(createDto.name)) { 
            throw new ServiceException(MESSAGE_CODE.TAG_NAME_ALREADY_EXISTS);
        }
        const tag = await this.tagRepository.createTag(createDto);
        return new TagDto(tag);
    }
    async findById(id: number): Promise<TagDto> {
        const tag = await this.tagRepository.findById(id);
        return new TagDto(tag);
    }
    async findEntityById(id: number): Promise<Tag> {
        return await this.tagRepository.findById(id);
    }
    // save: 기존 엔티티 수정 (Entity → DB 저장)
    async save(tag: Tag): Promise<TagDto> {
        return new TagDto(await this.tagRepository.save(tag));
    }

    async deleteById(id: number): Promise<boolean> {
        return await this.tagRepository.deleteById(id);
    }
    async findByTagName(name: string): Promise<Tag> {
        return await this.tagRepository.findByTagName(name);
    }
    async existsByTagName(name: string): Promise<boolean> {
        return await this.tagRepository.existsByTagName(name);
    }

    async findTagList(requestDto: TagFindRequestDto): Promise<TagDto[]> {
        const { category, usage } = requestDto;
        const tags = await this.tagRepository.findTagList(category, usage);
        return tags.map(tag => new TagDto(tag));
    }
    async findTagListGroupedByUsage(requestDto: TagFindRequestDto): Promise<string[]> {
        const { category, usage } = requestDto;
        const tags = await this.tagRepository.findTagList(category, usage);
        
        // 필터링할 usage와 category 결정
        const targetUsages = usage?.length ? usage : Object.values(UsageType);
        const targetCategories = category?.length ? category : Object.values(CategoryType);
        
        const grouped = new Map<UsageType, Map<CategoryType, string[]>>();
        
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
                            if (!tagList.some(t => t === tag.name)) {
                                tagList.push(tag.name);
                            }
                        }
                    });
                }
            });
        });
        
        // 중복 제거하여 태그 이름 배열 반환
        const tagNames = tags.map(tag => tag.name);
        return [...new Set(tagNames)];
    }

    async findByIds(ids: number[]): Promise<TagDto[]> {
        const tags = await this.tagRepository.findByIds(ids);
        return tags.map(tag => new TagDto(tag));
    }

}