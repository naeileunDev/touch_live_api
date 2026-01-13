import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { ADMIN_PERMISSION, ALL_PERMISSION, ANY_PERMISSION, USER_PERMISSION } from 'src/common/permission/permission';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { AuthFindIdDto } from 'src/auth/dto/auth-find-id.dto';
import { AuthPasswordResetDto } from 'src/auth/dto/auth-password-reset.dto';
import { AuthPasswordConfirmDto } from 'src/auth/dto/auth-password-confirm.dto';
import { JwtRefreshAuthGuard } from 'src/common/guard/jwt-refresh.guard';
//import { AuthSnsRegisterDto } from 'src/auth/dto/auth-sns-register.dto';
import { AuthSnsLoginDto } from 'src/auth/dto/auth-sns-login.dto';
import { AuthSnsLinkDto } from 'src/auth/dto/auth-sns-link.dto';
import { AuthSnsUnlinkDto } from 'src/auth/dto/auth-sns-unlink.dto';
import { GoogleGuard } from 'src/common/guard/google.guard';
import { Request, Response } from 'express';
import { KakaoGuard } from 'src/common/guard/kakao.guard';
import { NaverGuard } from 'src/common/guard/naver.guard';
import { UserCreateDto } from 'src/user/dto/user-create.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthNiceDecodingTokenIssueDto } from './dto/auth-nice-decoding-token-issue.dto';
import { NiceRedirectDto } from './dto/nice-redirect.dto';
import { ApiCreatedSuccessResponse, ApiNoContentSuccessResponse, ApiOkSuccessResponse} from 'src/common/decorator/swagger/api-response.decorator';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';
import { AuthFindIdResponseDto } from './dto/auth-find-id-response.dto';
import { NiceEncryptionTokenDto } from './dto/nice-encryption-token.dto';
import { NiceSuccessDto } from './dto/nice-success.dto';
import { AuthCheckRegisterFormDto } from './dto/auth-check-register-form.dto';
import { UserSignupSourceDto } from 'src/user/dto/user-signup-source.dto';
import { UserTermsAgreementDto } from 'src/user/dto/user-terms-agreement.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth('access-token')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Get('register')
    // @Role(ANY_PERMISSION)
    // @ApiOperation({ summary: '회원가입에 필요한 데이터 표기' })
    // @ApiOkSuccessResponse(AuthCheckRegisterFormDto, '회원가입에 필요한 데이터 표기 성공')
    // checkRegister() {
    //     return true;
    // }

    @Post('register')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '회원가입' })
    @ApiCreatedSuccessResponse(AuthLoginResponseDto, '회원가입 성공')
    @ApiExtraModels(UserCreateDto, UserSignupSourceDto, UserTermsAgreementDto) 
    register(@Body() authCheckRegisterFormDto: AuthCheckRegisterFormDto) {
        return this.authService.register(authCheckRegisterFormDto);
    }

    @Post('login')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '로그인' })
    @ApiOkSuccessResponse(AuthLoginResponseDto, '로그인 성공')
    login(@Body() authLoginDto: AuthLoginDto) {
        return this.authService.login(authLoginDto);
    }

    @Post('lookup/id')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '아이디 찾기' })
    @ApiOkSuccessResponse(AuthFindIdResponseDto, '아이디 찾기 성공')
    findIdBody(@Body()authFindIdDto: AuthFindIdDto) {
        return this.authService.findId(authFindIdDto);
    }

    @Post('password/reset')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: '비밀번호 재설정: 직전 비밀번호와 동일한 비밀번호는 사용할 수 없습니다. 로그인 아이디도 함께 확인합니다.' })
    @ApiOkSuccessResponse(Boolean, '비밀번호 재설정 성공')
    resetPassword(@GetUser() user: User, @Body() authPasswordResetDto: AuthPasswordResetDto) {
        return this.authService.resetPassword(userDto, authPasswordResetDto);
    }
    // @Post('password/reset')
    // @Role(ANY_PERMISSION)
    // @ApiOperation({ summary: '비밀번호 재설정: 직전 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.' })
    // @ApiOkSuccessResponse(Boolean, '비밀번호 재설정 성공')
    // resetPassword(@Body() authPasswordResetDto: AuthPasswordResetDto) {
    //     return this.authService.resetPassword(authPasswordResetDto);
    // }


    @Post('password/confirm')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '비밀번호 재확인' })
    @ApiOkSuccessResponse(Boolean, '비밀번호 재확인 성공')
    confirmPassword(@GetUser() user: User, @Body() authPasswordConfirmDto: AuthPasswordConfirmDto) {
        return this.authService.confirmPassword(userDto, authPasswordConfirmDto);
    }

    @Post('logout')
    @Role(ALL_PERMISSION)
    @ApiOperation({ summary: '로그아웃' })
    @ApiOkSuccessResponse(Boolean, '로그아웃 성공')
    logoutBody(@Req() req: Request, @GetUser() user: User) {
        return this.authService.logout(userDto, req.user['uuid']);
    }

    @Post('leave')
    @Role(USER_PERMISSION)
    @ApiOperation({ summary: '회원 탈퇴' })
    @ApiNoContentSuccessResponse('회원 탈퇴 성공')
    leaveBody(@GetUser() user: User) {
        return this.authService.leave(userDto);
    }

    @Post('token/reissue')
    @UseGuards(JwtRefreshAuthGuard)
    @ApiOperation({ summary: 'Access Token 재발급' })
    @ApiOkSuccessResponse(AuthLoginResponseDto, 'Access Token 재발급 성공')
    getAccessTokenBody(@Req() req: Request, @GetUser() user: User) {
        return this.authService.reissueAccessToken(userDto, req.headers.authorization?.replace('Bearer ', '') || '');
    }

    @Post('nice/access/token')
    @Role(ADMIN_PERMISSION)
    @ApiOperation({ summary: '[관리자] NICE 엑세스 토큰 발급' })
    @ApiOkSuccessResponse(String, 'NICE 엑세스 토큰 발급 성공')
    getNiceAccessTokenBody() {
        return this.authService.getNiceAccessToken();
    }

    @Post('nice/decoding/token')
    @Role(ANY_PERMISSION)
    @ApiOperation({ summary: 'NICE 암호화 토큰 발급 ( Nice 표준 웹 호출을 위한 값 리턴 )' })
    @ApiOkSuccessResponse(NiceEncryptionTokenDto, 'NICE 암호화 토큰 발급 성공')
    getNiceDecodingTokenBody(@Body() authNiceDecodingTokenIssueDto: AuthNiceDecodingTokenIssueDto) {
        return this.authService.getNiceDecodingToken(authNiceDecodingTokenIssueDto);
    }

    @Get('nice/success')
    @Role(ANY_PERMISSION)
    @ApiExcludeEndpoint()
    @ApiOperation({ summary: 'NICE 인증 성공 리다이렉트용 주소 [크롬]' })
    @ApiOkSuccessResponse(NiceSuccessDto, 'NICE 인증 성공 리다이렉트용 주소 성공')
    niceSuccess(@Req() req) {
        return this.authService.niceSuccess(req.query as NiceRedirectDto);
    }

    @Post('nice/success')
    @Role(ANY_PERMISSION)
    @ApiExcludeEndpoint()
    @ApiOperation({ summary: 'NICE 인증 성공 리다이렉트용 주소 [그 외]' })
    niceSuccessPost(@Req() req) {
        return this.authService.niceSuccess(req.body as NiceRedirectDto);
    }

    // @Post('sns/register')
    // @Role(ANY_PERMISSION)
    // @ApiOperation({ summary: 'SNS 회원가입' })
    // @ApiCreatedSuccessResponse(AuthLoginResponseDto, 'SNS 회원가입 성공')
    // registerSnsBody(@Body() authSnsRegisterDto: AuthSnsRegisterDto) {
    //     return this.authService.registerSns(authSnsRegisterDto);
    // }

    // @Post('sns/login')
    // @Role(ANY_PERMISSION)
    // @ApiOperation({ summary: 'SNS 로그인' })
    // loginSnsBody(@Body() authSnsLoginDto: AuthSnsLoginDto) {
    //     return this.authService.loginSns(authSnsLoginDto);
    // }

    // @Post('sns/link')
    // @Role(ALL_PERMISSION)
    // @ApiOperation({ summary: 'SNS 계정 연동' })
    // linkSnsBody(@GetUser() user: User, @Body() authSnsLinkDto: AuthSnsLinkDto) {
    //     return this.authService.linkSns(userDto, authSnsLinkDto);
    // }

    // @Post('sns/unlink')
    // @Role(ALL_PERMISSION)
    // @ApiOperation({ summary: 'SNS 계정 연동 해제' })
    // unlinkSnsBody(@GetUser() user: User, @Body() authSnsUnlinkDto: AuthSnsUnlinkDto) {
    //     return this.authService.unlinkSns(userDto, authSnsUnlinkDto);
    // }

    // @Get('login/google')
    // @UseGuards(GoogleGuard)
    // @ApiOperation({ summary: '구글 로그인' })
    // googleLogin() { }

    // @Get('login/google/callback')
    // @UseGuards(GoogleGuard)
    // @ApiExcludeEndpoint()
    // @ApiOperation({ summary: '구글 로그인 리다이렉트' })
    // googleLoginCallback(@Req() req) {
    //     return this.authService.oauthLogin(req.user);
    // }

    // @Get('login/kakao')
    // @UseGuards(KakaoGuard)
    // @ApiOperation({ summary: '카카오톡 로그인' })
    // kakaoLogin() { }

    // @Get('login/kakao/callback')
    // @UseGuards(KakaoGuard)
    // @ApiExcludeEndpoint()
    // @ApiOperation({ summary: '카카오톡 로그인 리다이렉트' })
    // kakaoLoginCallback(@Req() req) {
    //     return this.authService.oauthLogin(req.user);
    // }

    // @Get('login/naver')
    // @UseGuards(NaverGuard)
    // @ApiOperation({ summary: '네이버 로그인' })
    // naverLogin() { }

    // @Get('login/naver/callback')
    // @UseGuards(NaverGuard)
    // @ApiExcludeEndpoint()
    // @ApiOperation({ summary: '네이버 로그인 리다이렉트' })
    // naverLoginCallback(@Req() req) {
    //     return this.authService.oauthLogin(req.user);
    // }

    // @Post('login/apple/callback')
    // @ApiExcludeEndpoint()
    // @ApiOperation({ summary: '애플 로그인 리다이렉트' })
    // appleLoginCallback(@Req() req) {
    //     return this.authService.appleLogin(req.body);
    // }
}
