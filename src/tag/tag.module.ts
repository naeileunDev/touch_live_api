import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { TagRepository } from "./repository/tag.repository";
import { TagUsageLogRepository } from "./repository/tag-usage-log.repository";

@Module({
    controllers: [TagController],
    providers: [TagService, TagRepository, TagUsageLogRepository],
})
export class TagModule { }