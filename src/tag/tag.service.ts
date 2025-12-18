import { Injectable } from "@nestjs/common";
import { TagRepository } from "./repository/tag.repository";
import { TagUsageLogRepository } from "./repository/tag-usage-log.repository";
import { TagCreateDto } from "./dto/tag-create.dto";
import { TagDto } from "./dto/tag.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class TagService {
    getTagList(): import("./dto/tag.dto").TagDto[] | PromiseLike<import("./dto/tag.dto").TagDto[]> {
        throw new Error("Method not implemented.");
    }
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
}