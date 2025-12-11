import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { KeywordService } from "./keyword.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { KeywordFindDto } from "./dto/keyword-find.dto";
import { Role } from "src/common/decorator/role.decorator";
import { ANY_PERMISSION } from "src/common/permission/permission";
import { ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { KeywordFindResponseDto } from "./dto/keyword-find-response.dto";
import { UsageType } from "./enum/usage-type.enum";
import { CategoryType } from "./enum/category-type.enum";

@ApiTags('Keyword')
@ApiBearerAuth('access-token')
@Controller('keyword')
export class KeywordController {
    constructor(
        private readonly keywordService: KeywordService
    ) {
    }
    @Get('list')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '키워드 목록 조회' })
    @ApiOkSuccessResponse(KeywordFindDto, '키워드 목록 조회 성공', true)
    async getKeywordList(@Query() keywordFindDto: KeywordFindDto): Promise<KeywordFindResponseDto>{
        return await this.keywordService.getKeywordListWithCount(keywordFindDto);
    }
}
