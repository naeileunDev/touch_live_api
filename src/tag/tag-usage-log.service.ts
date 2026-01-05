import { Injectable } from "@nestjs/common";
import { TagUsageLogRepository } from "./repository/tag-usage-log.repository";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { TagUsageLogCreateDto } from "./dto/tag-usage-log-create.dto";
import { TagUsageLog } from "./entities/tag-usage-log.entity";
import { TagService } from "./tag.service";
import { TagUsageLogDto } from "./dto/tag-usage-log.dto";

@Injectable()
export class TagUsageLogService {
    constructor(
        private readonly tagService: TagService,
        private readonly tagUsageLogRepository: TagUsageLogRepository,
    ) {
    }

    async create(createDto: TagUsageLogCreateDto): Promise<TagUsageLogDto> {
        if (!await this.tagService.existsByTagName(createDto.tagName)) {
            throw new ServiceException(MESSAGE_CODE.TAG_NOT_FOUND);
        }
        const tagUsageLog = await this.tagUsageLogRepository.createTagUsageLog(createDto);
        return new TagUsageLogDto(tagUsageLog);
    }

    async findById(id: number): Promise<TagUsageLogDto> {
        return new TagUsageLogDto(await this.tagUsageLogRepository.findById(id));
    }

    async findEntityById(id: number): Promise<TagUsageLog> {
        return await this.tagUsageLogRepository.findById(id);
    }

    async save(tagUsageLog: TagUsageLog): Promise<TagUsageLogDto> {
        const savedTagUsageLog = await this.tagUsageLogRepository.save(tagUsageLog);
        return new TagUsageLogDto(savedTagUsageLog);
    }

    async deleteById(id: number): Promise<boolean> {
        return await this.tagUsageLogRepository.deleteById(id);
    }

}