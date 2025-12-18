import { Controller } from "@nestjs/common";
import { TagService } from "./tag.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('tag')
@ApiTags('Tag')
@ApiBearerAuth('access-token')
export class TagController {
    constructor(private readonly tagService: TagService) {
    }
}