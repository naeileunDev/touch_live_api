import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TermService } from "./service/term.service";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Role } from "src/common/decorator/role.decorator";
import { ALL_PERMISSION, OPERATOR_PERMISSION, USER_PERMISSION } from "src/common/permission/permission";
import { ApiCreatedSuccessResponse, ApiOkSuccessResponse } from "src/common/decorator/swagger/api-response.decorator";
import { TermVersionDto } from "./dto/term-version.dto";
import { TermVersionCreateDto } from "./dto/term-version-create.dto";
import { User } from "src/user/entity/user.entity";
import { GetUser } from "src/common/decorator/get-user.decorator";
import { TargetType } from "./enum/term-version.enum";
import { TermVersion } from "./entity/term-version.entity";
import { TermLogCreateDto } from "./dto/term-log-create.dto";
import { OptionalTermsFindDto } from "./dto/optional-terms-find.dto";
import { StoreOwner } from "src/common/decorator/store-owner.decorator";

@ApiTags('Term')
@Controller('term')
@ApiBearerAuth('access-token')
export class TermController {
    constructor(
        private readonly termService: TermService,
    ) {
    }

    @Post()
    @Role(OPERATOR_PERMISSION)
    @ApiOperation({ summary: '[운영자] 약관 버전 생성' })
    @ApiCreatedSuccessResponse(TermVersionDto, '약관 버전 생성 성공')
    createTermVersion(@Body() termVersionCreateDto: TermVersionCreateDto, @GetUser() user: User) {
        return this.termService.create(termVersionCreateDto, user);
    }
    
    @Get()
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '[모든 role] 해당 대상 약관 목록 조회(Query String: target=USER, STORE)' })
    @ApiOkSuccessResponse(TermVersionDto, '해당 대상(유저, 스토어) 약관 목록 조회 성공', true)
    findAllByTargetType(@Query('target') target: TargetType): Promise<TermVersion[]|[]> {
        return this.termService.findAllByTargetType(target);
    }

    @Post('user/agree')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '[유저] 약관 동의 기록 생성(비동의도 포함)' })
    @ApiBody({ type: TermLogCreateDto, isArray: true })
    @ApiOkSuccessResponse(Boolean, '약관 동의 기록 생성 성공')
    createUserTermAgreementChangeLog(@Body() dtos: TermLogCreateDto[], @GetUser() user: User): Promise<boolean> {
        return this.termService.createLog(dtos, user, TargetType.User);
    }

    @Get('user/optional')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '[유저] 해당 유저 선택 약관 현재 동의 상태 조회' })
    @ApiOkSuccessResponse(OptionalTermsFindDto, '선택 약관 조회 성공', true)
    findOptionalTermsUser(@GetUser() user: User): Promise<OptionalTermsFindDto[]> {
        return this.termService.findOptionalTermsStatus(user, TargetType.User);
    }

    @Post('user/me')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '[유저] 선택 약관 동의 기록 수정(수정할 값들만 보냅니다)' })
    @ApiBody({ type: TermLogCreateDto, isArray: true })
    @ApiOkSuccessResponse(Boolean, '약관 동의 기록 수정 성공')
    updateTermAgreeUser(@Body() dtos: TermLogCreateDto[], @GetUser() user: User): Promise<boolean> {
        return this.termService.updateTermLogMe(dtos, user, TargetType.User);
    }

    @Get('store/optional')
    @Role(USER_PERMISSION)
    @StoreOwner()
    @ApiOperation({ summary: '[스토어] 해당 스토어 선택 약관 현재 동의 상태 조회' })
    @ApiOkSuccessResponse(OptionalTermsFindDto, '선택 약관 조회 성공', true)
    findOptionalTermsStore(@GetUser() user: User): Promise<OptionalTermsFindDto[]> {
        return this.termService.findOptionalTermsStatus(user, TargetType.Store);
    }


    @Post('store/agree')
    @Role(USER_PERMISSION)
    @StoreOwner()
    @ApiOperation({ summary: '[스토어] 약관 동의 기록 생성(비동의도 포함)' })
    @ApiBody({ type: TermLogCreateDto, isArray: true })
    @ApiOkSuccessResponse(Boolean, '약관 동의 기록 생성 성공')
    createStoreTermAgreementChangeLog(@Body() dtos: TermLogCreateDto[], @GetUser() user: User): Promise<boolean> {
        return this.termService.createLog(dtos, user, TargetType.Store);
    }

    @Post('store/me')
    @Role(USER_PERMISSION)
    @StoreOwner()
    @ApiOperation({ summary: '[스토어] 선택 약관 동의 기록 수정(수정할 값들만 보냅니다)' })
    @ApiBody({ type: TermLogCreateDto, isArray: true })
    @ApiOkSuccessResponse(Boolean, '약관 동의 기록 수정 성공')
    updateTermAgreeStore(@Body() dtos: TermLogCreateDto[], @GetUser() user: User): Promise<boolean> {
        return this.termService.updateTermLogMe(dtos, user, TargetType.Store);
    }
}
