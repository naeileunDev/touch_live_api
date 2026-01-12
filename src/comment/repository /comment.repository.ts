import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Comment } from "../entity/comment.entity";

@Injectable()
export class CommentRepository extends Repository<Comment> {
    constructor(private readonly dataSource: DataSource) {
        super(Comment, dataSource.createEntityManager());
    }
}