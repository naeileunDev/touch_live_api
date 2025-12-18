import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { TagDto } from "./dto/tag.dto";
import { TagCreateDto } from "./dto/tag-create.dto";
import { Role } from "src/common/decorator/role.decorator";
import { ALL_PERMISSION, OPERATOR_PERMISSION } from "src/common/permission/permission";
import { TagFindDto } from "./dto/tag-find.dto";
import { TagFindResponseDto } from "./dto/tag-find-response.dto";

@Controller('tag')
@ApiTags('Tag')
@ApiBearerAuth('access-token')
export class TagController {
    constructor(private readonly tagService: TagService) {
    }
    
    @Post('create')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[운영자] 태그 생성' })
    @ApiCreatedSuccessResponse(TagDto, '태그 생성 성공')
    async createTag(@Body() tagCreateDto: TagCreateDto): Promise<TagDto> {
        return await this.tagService.createTag(tagCreateDto);
    }

    @Get('exist')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[운영자] 태그 존재 여부 조회' })
    @ApiOkSuccessResponse(Boolean, '태그 존재여부 확인 성공')
    async existsByTagName(@Query('name') name: string): Promise<boolean> {
        return await this.tagService.existsByTagName(name);
    }

    @Get('list')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 태그 목록 조회 (사용처별 그룹화)' })
    @ApiOkSuccessResponse(TagFindResponseDto, '태그 목록 조회 성공', true)
    async getTagList(@Query() tagFindDto: TagFindDto): Promise<TagFindResponseDto[]> {
        return await this.tagService.findTagListGroupedByUsage(tagFindDto);
    }
}