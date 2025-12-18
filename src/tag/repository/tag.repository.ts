import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Tag } from "../entity/tag.entity";
import { TagCreateDto } from "../dto/tag-create.dto";

@Injectable()
export class TagRepository extends Repository<Tag> {
    constructor(private dataSource: DataSource) {
        super(Tag, dataSource.createEntityManager());
    }

    async createTag(tag: TagCreateDto): Promise<Tag> {
        return await this.save(tag);
    }
}