import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { TagDto } from "./dto/tag.dto";
import { TagCreateDto } from "./dto/tag-create.dto";
import { Role } from "src/common/decorator/role.decorator";
import { ALL_PERMISSION, OPERATOR_PERMISSION } from "src/common/permission/permission";
import { TagFindRequestDto } from "./dto/tag-find-request.dto";
import { TagFindDto } from "./dto/tag-find.dto";

@ApiTags('Tag')
@Controller('tag')
@ApiBearerAuth('access-token')
export class TagController {
    constructor(private readonly tagService: TagService) {
    }
    
    @Post('create')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[운영자] 태그 생성' })
    @ApiCreatedSuccessResponse(TagDto, '태그 생성 성공')
    async create(@Body() createDto: TagCreateDto): Promise<TagDto> {
        return await this.tagService.create(createDto);
    }

    @Get('exist')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[운영자] 태그 존재 여부 조회' })
    @ApiOkSuccessResponse(Boolean, '태그 존재여부 확인 성공')
    async exists(@Query('name') name: string): Promise<boolean> {
        return await this.tagService.existsByTagName(name);
    }

    @Get('find/id')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 태그 조회' })
    @ApiOkSuccessResponse(TagDto, '태그 조회 성공')
    async findById(@Query('id') id: number): Promise<TagDto> {
        return await this.tagService.findById(id);
    }

    @Get('find/list')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 태그 목록 조회 (사용처별 그룹화)' })
    @ApiOkSuccessResponse(TagFindDto, '태그 목록 조회 성공', true)
    async findTagList(@Query() requestDto: TagFindRequestDto): Promise<string[]> {
        return await this.tagService.findTagListGroupedByUsage(requestDto);
    }
}