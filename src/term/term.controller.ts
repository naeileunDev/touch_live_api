import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TermService } from "./term.service";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Role } from "src/common/decorator/role.decorator";
import { ALL_PERMISSION, OPERATOR_PERMISSION, USER_PERMISSION } from "src/common/permission/permission";
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { TermVersionDto } from "./dto /term-version.dto";
import { TermVersionCreateDto } from "./dto /term-version-create.dto";
import { User } from "src/user/entity/user.entity";
import { GetUser } from "src/common/decorator/get-user.decorator";
import { TargetType } from "./enum/term-version.enum";

@ApiTags('Term')
@Controller('term')
@ApiBearerAuth('access-token')
export class TermController {
    constructor(
        private readonly termService: TermService,
    ) {
    }

    @Post('version')
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[운영자] 약관 버전 생성' })
    @ApiCreatedSuccessResponse(TermVersionDto, '약관 버전 생성 성공')
    createTermVersion(@Body() termVersionCreateDto: TermVersionCreateDto, @GetUser() user: User) {
        return this.termService.create(termVersionCreateDto, user);
    }
    
    @Get(':target')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 해당 대상 약관 조회' })
    @ApiOkSuccessResponse(TermVersionDto, '해당 대상 약관 조회 성공', true)
    findAllByTargetType(@Param('target') target: TargetType): Promise<TermVersionDto[]> {
        return this.termService.findAllByTargetType(target);
    }
    // @Get('user/not-agreed')
    // @Role(USER_PERMISSION)
    // @ApiOperation({ summary: '[유저] 약관 동의 여부 조회' })
    // @ApiOkSuccessResponse(Boolean, '약관 동의 여부 조회 성공')
    // findUserNotAgreedTermVersion(@GetUser() user: User): Promise<Boolean> {
    //     return this.termService.findAllByRequired(true, TargetType.User);
    // }
}