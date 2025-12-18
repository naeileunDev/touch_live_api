import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { TagDto } from "./dto/tag.dto";
import { TagCreateDto } from "./dto/tag-create.dto";
import { Role } from "src/common/decorator/role.decorator";
import { OPERATOR_PERMISSION } from "src/common/permission/permission";

@Controller('tag')
@ApiTags('Tag')
@ApiBearerAuth('access-token')
export class TagController {
    constructor(private readonly tagService: TagService) {
    }
    
    @Post('create')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '태그 생성' })
    @ApiCreatedSuccessResponse(TagDto, '태그 생성 성공')
    async createTag(@Body() tagCreateDto: TagCreateDto): Promise<TagDto> {
        return await this.tagService.createTag(tagCreateDto);
    }

    @Get('exist')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '태그 존재 여부 조회' })
    @ApiOkSuccessResponse(Boolean, '태그 존재여부 확인 성공')
    async existsByTagName(@Query('name') name: string): Promise<boolean> {
        return await this.tagService.existsByTagName(name);
    }
}