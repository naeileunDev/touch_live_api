import { DataSource, Repository } from "typeorm";
import { TagUsageLog } from "../entity/tag-usage-log";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TagUsageLogRepository extends Repository<TagUsageLog> {
    constructor(private dataSource: DataSource) {
        super(TagUsageLog, dataSource.createEntityManager());
    }
    
    async createTagUsageLog(tagUsageLog: TagUsageLog): Promise<TagUsageLog> {
        return await this.save(tagUsageLog);
    }
}