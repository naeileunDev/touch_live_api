import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";

@ApiTags('Comment')
@Controller('comments')
@ApiBearerAuth('access-token')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}
}