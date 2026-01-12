import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { CommentRepository } from "./repository /comment.repository";

@Module({
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
    exports: [CommentService],
})
export class CommentModule {}