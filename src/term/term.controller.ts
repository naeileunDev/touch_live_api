import { Body, Controller, Post } from "@nestjs/common";
import { TermService } from "./term.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { TermsTemplate } from "./entity/terms-template.entity";
import { TermTemplateCreateDto } from "./dto/term-template-create.dto";
import { Role } from "src/common/decorator/role.decorator";
import { ANY_PERMISSION, OPERATOR_PERMISSION } from "src/common/permission/permission";
import { ConvertHtmlToMarkdownDto } from "./dto/convert-html-to-markdown.dto";

@ApiTags('Term')
@Controller('term')
@ApiBearerAuth('access-token')
export class TermController {
    constructor(private readonly termService: TermService) {
    }
    @Post('register')
    @Role(ANY_PERMISSION)
    @ApiBody({ type: TermTemplateCreateDto, description: '약관 등록 요청 데이터' })
    @ApiOperation({ summary: '약관 등록' })
    @ApiOkSuccessResponse(TermsTemplate, '약관 등록 성공')
    register(@Body() termTemplateCreateDto: TermTemplateCreateDto) {
        return this.termService.createTermsTemplate(termTemplateCreateDto);
    }

    @Post('html-to-markdown')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: 'HTML을 Markdown으로 변환' })
    @ApiOkSuccessResponse(String, 'HTML을 Markdown으로 변환 성공')
    convert(@Body() convertHtmlDto: ConvertHtmlToMarkdownDto): Promise<string> {
        return this.termService.convertHtmlFileToMarkdown(convertHtmlDto)
    }
}