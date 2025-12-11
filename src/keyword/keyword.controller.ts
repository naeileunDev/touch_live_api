import { Controller } from "@nestjs/common";
import { KeywordService } from "./keyword.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Keyword')
@ApiBearerAuth('access-token')
@Controller('keyword')
export class KeywordController {
    constructor(
        private readonly keywordService: KeywordService
    ) {
    }
}