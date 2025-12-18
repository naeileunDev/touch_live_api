import { Injectable } from "@nestjs/common";
import { TagRepository } from "./repository/tag.repository";
import { TagUsageLogRepository } from "./repository/tag-usage-log.repository";

@Injectable()
export class TagService {
    constructor(
        private readonly tagRepository: TagRepository,
        private readonly tagUsageLogRepository: TagUsageLogRepository,
    ) {
    }
    
}