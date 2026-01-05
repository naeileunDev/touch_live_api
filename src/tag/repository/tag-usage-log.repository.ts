import { DataSource, DeleteResult, Repository } from "typeorm";
import { TagUsageLog } from "../entity/tag-usage-log.entity";
import { Injectable } from "@nestjs/common";
import { TagUsageLogCreateDto } from "../dto/tag-usage-log-create.dto";

@Injectable()
export class TagUsageLogRepository extends Repository<TagUsageLog> {
    constructor(private dataSource: DataSource) {
        super(TagUsageLog, dataSource.createEntityManager());
    }
    
    async createTagUsageLog(dto: TagUsageLogCreateDto): Promise<TagUsageLog> {
        const tagUsageLog = this.create(dto);
        return await this.save(tagUsageLog);
    }

    async findById(id: number): Promise<TagUsageLog> {
        return await this.findOne({
            where: {
                id,
            },
        });
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }
}