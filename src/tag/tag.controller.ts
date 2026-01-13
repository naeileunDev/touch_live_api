import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { TagDto } from "./dto/tag.dto";
import { TagCreateDto } from "./dto/tag-create.dto";
import { Role } from "src/common/decorator/role.decorator";
import { ALL_PERMISSION, ANY_PERMISSION, OPERATOR_PERMISSION } from "src/common/permission/permission";
import { TagFindRequestDto } from "./dto/tag-find-request.dto";
import { TagFindDto } from "./dto/tag-find.dto";
import { TagCheckDto } from "./dto/tag-check.dto";

@ApiTags('Tag')
@Controller('tag')
@ApiBearerAuth('access-token')
export class TagController {
    constructor(private readonly tagService: TagService) {
    }
    
    @Post()
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[운영자] 태그 생성' })
    @ApiCreatedSuccessResponse(TagDto, '태그 생성 성공')
    create(@Body() createDto: TagCreateDto): Promise<TagDto> {
        return this.tagService.create(createDto);
    }

    @Get('exists')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[운영자] 태그 존재 여부 조회' })
    @ApiOkSuccessResponse(Boolean, '태그 존재여부 확인 성공')
    exists(@Query('name') name: string): Promise<boolean> {
        return this.tagService.existsByTagName(name);
    }

    @Get(':id')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 태그 조회' })
    @ApiOkSuccessResponse(TagDto, '태그 조회 성공')
    findById(@Param('name') name: string): Promise<TagDto> {
        return this.tagService.findByTagName(name);
    }

    @Get()
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 태그 목록 조회 (사용처별 그룹화)' })
    @ApiOkSuccessResponse(TagFindDto, '태그 목록 조회 성공', true)
    findByUsageAndCategory(@Query() requestDto: TagFindRequestDto): Promise<string[]> {
        return this.tagService.findByUsageAndCategory(requestDto);
    }

    @Get('check/tags')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 메인태그와 서브태그 중복 여부 조회' })
    @ApiOkSuccessResponse(Boolean, '메인태그와 서브태그 중복 여부 조회 성공')
    checkTags(@Query() tagCheckDto: TagCheckDto): Promise<boolean> {
        return this.tagService.checkTags(tagCheckDto);
    }
}