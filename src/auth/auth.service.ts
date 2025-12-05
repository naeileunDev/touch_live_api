import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UserCreateDto } from "src/user/dto/user-create.dto";
import { AuthLoginResponseDto } from "./dto/auth-login-response.dto";
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from "src/user/enum/user-role.enum";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";
import { AuthNiceSessionDataDto } from "./dto/auth-nice-session-data.dto";
import { AuthLoginDto } from "./dto/auth-login.dto";
import * as crypto from 'crypto';
import { compare, genSaltSync, hashSync } from 'bcrypt';
import { UserDto } from "src/user/dto/user.dto";
//import { AuthSnsRegisterDto } from "./dto/auth-sns-register.dto";
import { AuthSnsProfileDto } from "./dto/auth-sns-profile.dto";
import { UserOauthCreateDto } from "src/user/dto/user-oauth-create.dto";
import { AuthSnsLoginDto } from "./dto/auth-sns-login.dto";
import { AuthSnsLinkDto } from "./dto/auth-sns-link.dto";
import { UserOauthDto } from "src/user/dto/user-oauth.dto";
import { AuthSnsUnlinkDto } from "./dto/auth-sns-unlink.dto";
import { AuthSnsLoginResponseDto } from "./dto/auth-sns-login-response.dto";
import { AuthAppleLoginDto } from "./dto/auth-apple-login.dto";
import { UserOauthType } from "src/user/enum/user-oauth-type.enum";
import axios from "axios";
import { AuthFindIdDto } from "./dto/auth-find-id.dto";
import { AuthFindIdResponseDto } from "./dto/auth-find-id-response.dto";
import { AuthPasswordResetDto } from "./dto/auth-password-reset.dto";
import { UserDeviceCreateDto } from "src/user/dto/user-device-create.dto";
import { NiceEncryptionTokenDto } from "./dto/nice-encryption-token.dto";
import { NiceTokenVersionDataDto } from "./dto/nice-token-version-data.dto";
import { NiceRedirectDto } from "./dto/nice-redirect.dto";
import { NiceSuccessDto } from "./dto/nice-success.dto";
import { AuthPasswordConfirmDto } from "./dto/auth-password-confirm.dto";
import { AuthNiceDecodingTokenIssueDto } from "./dto/auth-nice-decoding-token-issue.dto";
import { NiceAuthRequestPurpose } from "./enum/nice-auth-request-history-purpose.enum";
import { AuthCheckRegisterFormDto } from "./dto/auth-check-register-form.dto";
import { domainToASCII } from "url";
import { UserGender } from "src/user/enum/user-gender.enum";

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly jwksClient: jwksClient.JwksClient,
    ) { }

    // Nice
    private clientId: string = this.configService.get('NICE_CLIENT_ID');
    private secretKey: string = this.configService.get('NICE_SECRET_KEY');

    // 개인정보 암호화 키
    private ENCRYPTION_KEY = this.configService.get('ENCRYPTION_KEY');
    private FIXED_IV = Buffer.from(this.configService.get('FIXED_IV'));



    /**
     * 회원가입
     * @param userCreateDto 회원가입 DTO
     */
    async register(dto: AuthCheckRegisterFormDto): Promise<AuthLoginResponseDto> {
        const userInfo = dto.userInfo;
        const uuid = uuidv4();

        // 토큰 유효기간 확인
        //const isExpired = this.isJwtTokenExpired(userInfo.sessionKey);
        const isExpired = false;
        if (isExpired) {
            throw new ServiceException(MESSAGE_CODE.NICE_SESSION_KEY_EXPIRED);
        }
        console.log("isExpired:", isExpired);
        // CI, DI 캐시 조회
        //const niceSessionData: AuthNiceSessionDataDto = await this.cacheManager.get(userInfo.sessionKey);
        const niceSessionData: AuthNiceSessionDataDto = {
            ci: 'CI',
            name: userInfo.name,
            phone: userInfo.phone,
            gender: userInfo.gender,
            birth: userInfo.birth,
            di: userInfo.di
        }
        if (!niceSessionData) {
            throw new ServiceException(MESSAGE_CODE.NICE_SESSION_DATA_MISSING);
        }
        userInfo.name = niceSessionData.name;
        userInfo.phone = niceSessionData.phone;
        userInfo.gender = niceSessionData.gender;
        userInfo.birth = niceSessionData.birth;
        userInfo.di = niceSessionData.di;

        // 캐시에서 NICE 정보 삭제
        //await this.cacheManager.del(userInfo.sessionKey);


        // 중복 사용자 확인
        const isDuplicateDi = await this.userService.existsByDiWithDeleted(userInfo.di);
        if (isDuplicateDi) {
            throw new ServiceException(MESSAGE_CODE.USER_ALREADY_EXISTS);
        }

        // 이미 존재하는 아이디인지 확인
        const isExistUser = await this.userService.existsByLoginIdWithDeleted(userInfo.loginId);
        if (isExistUser) {
            throw new ServiceException(MESSAGE_CODE.USER_LOGIN_ID_ALREADY_EXISTS);
        }

        // 비밀번호 암호화
        userInfo.password = this.hashPassword(userInfo.password);

        // 사용자 생성
        const userDto = await this.userService.create(dto);

        const accessToken = await this.generateAccessToken(userDto, uuid, userInfo.fcmToken);
        const refreshToken = await this.generateRefreshToken(userDto, uuid);
        return new AuthLoginResponseDto(userDto, accessToken, refreshToken);
    }

    /**
     * 로그인
     * @param authLoginDto 로그인 DTO
     */
    async login(authLoginDto: AuthLoginDto, roles: UserRole[]): Promise<AuthLoginResponseDto> {
        const { loginId, password, fcmToken } = authLoginDto;
        // 로그인 실패 5회 이상일 경우 10분 동안 로그인 제한
        const loginFailedCount: number = await this.cacheManager.get(`login_failed_count:${loginId}`) ?? 0;
        if (loginFailedCount >= 5) {
            throw new ServiceException(MESSAGE_CODE.AUTH_LOGIN_FAILED_LIMIT);
        }
        const user = await this.userService.findEntityByLoginIdAndRoles(loginId, roles);
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            await this.cacheManager.set(`login_failed_count:${loginId}`, loginFailedCount + 1, 10 * 60 * 1000);
            throw new ServiceException(MESSAGE_CODE.USER_PASSWORD_MISMATCH);
        }

        const uuid = uuidv4();
        const userDto = new UserDto(user);
        const accessToken = await this.generateAccessToken(userDto, uuid, fcmToken);
        const refreshToken = await this.generateRefreshToken(userDto, uuid);
        return new AuthLoginResponseDto(userDto, accessToken, refreshToken);
    }

    // /**
    //  * SNS 회원가입
    //  * @param authSnsRegisterDto SNS 회원가입 DTO
    //  */
    // async registerSns(authSnsRegisterDto: AuthSnsRegisterDto): Promise<AuthLoginResponseDto> {
    //     const { niceSessionKey, snsSessionKey, fcmToken } = authSnsRegisterDto;
    //     const uuid = uuidv4();

    //     // 기본 역할 설정
    //     authSnsRegisterDto.role = UserRole.User;

    //     // NICE 세션 토큰 유효기간 확인
    //     const isNiceSessionKeyExpired = this.isJwtTokenExpired(niceSessionKey);
    //     if (isNiceSessionKeyExpired) {
    //         throw new ServiceException(MESSAGE_CODE.NICE_SESSION_KEY_EXPIRED);
    //     }

    //     // SNS 세션 토큰 유효기간 확인
    //     const isSnsSessionKeyExpired: boolean = this.isJwtTokenExpired(snsSessionKey);
    //     if (isSnsSessionKeyExpired) {
    //         throw new ServiceException(MESSAGE_CODE.SNS_SESSION_KEY_EXPIRED);
    //     }

    //     // NICE 세션키로부터 DI, CI 조회
    //     const niceSessionData: AuthNiceSessionDataDto = await this.cacheManager.get(niceSessionKey);
    //     if (!niceSessionData) {
    //         throw new ServiceException(MESSAGE_CODE.NICE_SESSION_DATA_MISSING);
    //     }

    //     // 캐시에서 NICE 정보 삭제
    //     await this.cacheManager.del(niceSessionKey);

    //     // SNS 세션키로부터 Oauth 프로필 조회
    //     const snsProfile: AuthSnsProfileDto = await this.cacheManager.get(snsSessionKey);
    //     if (!snsProfile) {
    //         throw new ServiceException(MESSAGE_CODE.SNS_SESSION_DATA_MISSING);
    //     }

    //     // 캐시에서 SNS 정보 삭제
    //     await this.cacheManager.del(snsSessionKey);

    //     // Oauth 중복 확인
    //     const isExistOauth = await this.userService.existsBySnsUserIdAndTypeWithDeleted(snsProfile.snsUserId, snsProfile.type);
    //     if (isExistOauth) {
    //         throw new ServiceException(MESSAGE_CODE.USER_OAUTH_ALREADY_LINKED);
    //     }

    //     const userCreateDto = new UserCreateDto();
    //     userCreateDto.fcmToken = fcmToken;
    //     userCreateDto.name = niceSessionData.name;
    //     userCreateDto.phone = niceSessionData.phone;
    //     userCreateDto.gender = niceSessionData.gender;
    //     userCreateDto.birth = niceSessionData.birth;
    //     userCreateDto.di = niceSessionData.di;

    //     // 중복 사용자 확인
    //     const isDuplicateDi = await this.userService.existsByDiWithDeleted(userCreateDto.di);
    //     if (isDuplicateDi) {
    //         throw new ServiceException(MESSAGE_CODE.USER_ALREADY_EXISTS);
    //     }

    //     // 사용자 생성
    //     const userDto = await this.userService.create(userCreateDto);

    //     // Oauth 등록
    //     const userOauthCreateDto: UserOauthCreateDto = {
    //         snsUserId: snsProfile.snsUserId,
    //         email: snsProfile.email,
    //         type: snsProfile.type,
    //         user: userDto
    //     }
    //     await this.userService.createUserOauth(userOauthCreateDto);

    //     const accessToken = await this.generateAccessToken(userDto, uuid, fcmToken);
    //     const refreshToken = await this.generateRefreshToken(userDto, uuid);
    //     return new AuthLoginResponseDto(userDto, accessToken, refreshToken);
    // }


    /**
     * SNS 로그인
     * @param authSnsLoginDto SNS 로그인 DTO
     */
    async loginSns(authSnsLoginDto: AuthSnsLoginDto): Promise<AuthLoginResponseDto> {
        const { sessionKey, fcmToken } = authSnsLoginDto;
        const uuid = uuidv4();

        // SNS 세션 토큰 유효기간 확인
        const isSessionKeyExpired: boolean = this.isJwtTokenExpired(sessionKey);
        if (isSessionKeyExpired) {
            throw new ServiceException(MESSAGE_CODE.SNS_SESSION_KEY_EXPIRED);
        }

        // SNS 세션키로부터 Oauth 프로필 조회
        const snsProfile: AuthSnsProfileDto = await this.cacheManager.get(sessionKey);
        if (!snsProfile) {
            throw new ServiceException(MESSAGE_CODE.SNS_SESSION_DATA_MISSING);
        }

        // 캐시에서 SNS 정보 삭제
        await this.cacheManager.del(sessionKey);

        const userOauth = await this.userService.findUserOauthBySnsUserIdAndType(snsProfile.snsUserId, snsProfile.type);

        const userDto = await this.userService.findById(userOauth.userId);
        const accessToken = await this.generateAccessToken(userDto, uuid, fcmToken);
        const refreshToken = await this.generateRefreshToken(userDto, uuid);
        return new AuthLoginResponseDto(userDto, accessToken, refreshToken);
    }


    /**
     * SNS 계정 연동
     * @param authSnsLinkDto SNS 계정 연동 DTO
     */
    async linkSns(userDto: UserDto, authSnsLinkDto: AuthSnsLinkDto): Promise<UserOauthDto> {
        const { sessionKey } = authSnsLinkDto;
        const user = await this.userService.findById(userDto.id);

        // SNS 세션 토큰 유효기간 확인
        const isSessionKeyExpired: boolean = this.isJwtTokenExpired(sessionKey);
        if (isSessionKeyExpired) {
            throw new ServiceException(MESSAGE_CODE.SNS_SESSION_KEY_EXPIRED);
        }

        // SNS 로그인 정보가 캐시에 존재하는지 확인
        const snsProfile: AuthSnsProfileDto = await this.cacheManager.get(sessionKey);
        if (!snsProfile) {
            throw new ServiceException(MESSAGE_CODE.SNS_SESSION_DATA_MISSING);
        }

        // 캐시에서 SNS 정보 삭제
        await this.cacheManager.del(sessionKey);


        // Oauth 중복 확인
        const isExistOauth = await this.userService.existsBySnsUserIdAndTypeWithDeleted(snsProfile.snsUserId, snsProfile.type);
        if (isExistOauth) {
            throw new ServiceException(MESSAGE_CODE.USER_OAUTH_ALREADY_LINKED);
        }

        // Oauth 등록
        const userOauthCreateDto: UserOauthCreateDto = {
            snsUserId: snsProfile.snsUserId,
            email: snsProfile.email,
            type: snsProfile.type,
            user: userDto
        }
        return await this.userService.createUserOauth(userOauthCreateDto);
    }

    /**
     * SNS 계정 연동 해제
     * @param oauthUnlinkDto SNS 계정 연동 해제 DTO
     */
    async unlinkSns(userDto: UserDto, authSnsUnlinkDto: AuthSnsUnlinkDto): Promise<boolean> {
        const user = await this.userService.findById(userDto.id);
        const userOauth = await this.userService.findUserOauthEntityByUserIdAndType(user.id, authSnsUnlinkDto.type);
        return await this.userService.deleteUserOauthById(userOauth.id);
    }

    /**
     * Oauth 로그인
     * @param oauthCode Oauth 인증 코드
     * @param UserOauthType Oauth 타입
     */
    async oauthLogin(authSnsProfileDto: AuthSnsProfileDto): Promise<AuthSnsLoginResponseDto> {
        // 세션키 생성 및 캐시에 DI, CI 저장 
        const sessionKey = this.jwtService.sign(
            { uuid: uuidv4() },
            {
                secret: this.configService.get('JWT_OAUTH_SESSION_KEY_SECRET'),
                expiresIn: this.configService.get('JWT_OAUTH_SESSION_KEY_EXPIRES_IN'),
                algorithm: 'HS256',
            }
        );

        await this.cacheManager.set(
            sessionKey,
            authSnsProfileDto,
            this.configService.get<number>('OAUTH_SESSION_KEY_TTL_MINUTE') * 60 * 1000
        );

        const isExistOauth = await this.userService.existsBySnsUserIdAndTypeWithDeleted(authSnsProfileDto.snsUserId, authSnsProfileDto.type);
        return {
            sessionKey,
            isUser: isExistOauth
        }
    }

    /**
     * 애플 로그인
     * @param oauthAppleLoginDto 애플 로그인 DTO
     */
    async appleLogin(authAppleLoginDto: AuthAppleLoginDto): Promise<AuthSnsLoginResponseDto> {
        const { code } = authAppleLoginDto;
        const redirectUri = `${this.configService.get('CLIENT_IP')}/api/auth/login/apple/callback`;
        // 1. Apple 서버에서 Tokens (access_token, id_token 등) 가져오기
        const tokens = await this.getAppleTokens(code, redirectUri);

        // 2. ID Token 검증 및 Apple User ID 추출
        const appleUserPayload = await this.verifyIdToken(tokens.id_token);
        const appleUserId = appleUserPayload.sub; // Apple에서 부여한 고유 사용자 ID
        const email = appleUserPayload.email; // 이메일 (사용자가 허용한 경우에만 존재)
        const authSnsProfileDto: AuthSnsProfileDto = {
            snsUserId: appleUserId,
            email: email || '',
            type: UserOauthType.Apple
        }
        return this.oauthLogin(authSnsProfileDto);
    }

    // 1. Apple로부터 받은 authorization code를 사용하여 토큰을 요청
    private async getAppleTokens(code: string, redirectUri: string) {
        const url = 'https://appleid.apple.com/auth/token';

        // Apple 서버에 요청할 JWT (Client Secret) 생성
        const clientSecret = this.generateClientSecret();

        const data = {
            client_id: this.configService.get('APPLE_CLIENT_ID'),
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
        };

        try {
            const response = await axios.post(url, new URLSearchParams(data));
            // response.data에는 access_token, refresh_token, id_token이 포함됨
            return response.data;
        } catch (error) {
            console.error('Apple Token Exchange Error:', error.response?.data || error.message);
            throw new ServiceException(MESSAGE_CODE.APPLE_TOKEN_EXCHANGE_FAILED);
        }
    }

    // 2. ID Token을 검증하고 사용자 정보 (Payload)를 추출
    private async verifyIdToken(idToken: string): Promise<any> {
        const decodedToken = jwt.decode(idToken, { complete: true });
        if (!decodedToken || typeof decodedToken === 'string') {
            throw new ServiceException(MESSAGE_CODE.APPLE_ID_TOKEN_INVALID_FORMAT);
        }

        const kid = decodedToken.header.kid;
        const key = await this.jwksClient.getSigningKey(kid);
        const publicKey = key.getPublicKey();

        // JWT 서명 검증 및 디코딩
        try {
            const payload = jwt.verify(idToken, publicKey, {
                algorithms: ['RS256'],
                // Apple이 발행한 토큰인지 확인
                issuer: 'https://appleid.apple.com',
                // 우리 앱의 클라이언트 ID와 일치하는지 확인
                audience: this.configService.get('APPLE_CLIENT_ID'),
            });

            // payload.sub (Apple User ID)와 payload.email (선택적) 정보 포함
            return payload;

        } catch (error) {
            console.error('ID Token Verification Error:', error.message);
            throw new ServiceException(MESSAGE_CODE.APPLE_ID_TOKEN_INVALID_OR_EXPIRED);
        }
    }

    // 3. Apple 서버에 인증된 요청을 보낼 때 필요한 Client Secret JWT 생성
    private generateClientSecret(): string {
        const teamId = this.configService.get<string>('APPLE_TEAM_ID');
        const clientId = this.configService.get<string>('APPLE_CLIENT_ID');
        const keyId = this.configService.get<string>('APPLE_KEY_ID');
        const privateKey = this.configService.get<string>('APPLE_PRIVATE_KEY');

        const claims = {
            iss: teamId,
            iat: Math.floor(Date.now() / 1000), // 발행 시간
            exp: Math.floor(Date.now() / 1000) + (60 * 5), // 만료 시간 (최대 6개월이지만, 토큰 교환용은 짧게 설정)
            aud: 'https://appleid.apple.com', // Audience는 항상 Apple 인증 서버
            sub: clientId, // Subject는 Client ID
        };

        return jwt.sign(claims, privateKey, {
            algorithm: 'ES256',
            keyid: keyId
        });
    }

    /**
     * 아이디 찾기
     * @param authFindIdDto 아이디 찾기 DTO
     */
    async findId(authFindIdDto: AuthFindIdDto): Promise<AuthFindIdResponseDto> {
        const { sessionKey } = authFindIdDto;

        // 토큰 유효기간 확인
        // const isExpired = this.isJwtTokenExpired(sessionKey);
        // if (isExpired) {
        //     throw new ServiceException(MESSAGE_CODE.NICE_SESSION_KEY_EXPIRED);
        // }

        // CI, DI 캐시 조회
        // const sessionData: AuthNiceSessionDataDto = await this.cacheManager.get(sessionKey);
        // if (!sessionData) {
        //     throw new ServiceException(MESSAGE_CODE.NICE_SESSION_DATA_MISSING);
        // }

        // // 캐시에서 NICE 정보 삭제
        // await this.cacheManager.del(sessionKey);

        const authFindIdResponseDto = new AuthFindIdResponseDto();

        // 삭제된 회원인지 확인
        //const isExistRemovedDi = await this.userService.existsByDiWithDeleted(sessionData.di);
        const isExistRemovedDi = await this.userService.existsByDiWithDeleted(sessionKey);
        const user = await this.userService.findEntityByDi(sessionKey);
        // 사용자 조회
        //const user = await this.userService.findByDi(sessionData.di);
        if (!user && isExistRemovedDi) {
            throw new ServiceException(MESSAGE_CODE.USER_REMOVED_STATUS);
        }
        authFindIdResponseDto.loginId = user.loginId;
        return authFindIdResponseDto;
    }

    /**
     * 비밀번호 암호화
     * @param password 비밀번호
     */
    private hashPassword(password: string): string {
        const salt = genSaltSync(10);
        return hashSync(password, salt);
    }

    /**
     * 비밀번호 재설정
     * @param authPasswordResetDto 비밀번호 재설정 DTO
     */
    async resetPassword(authPasswordResetDto: AuthPasswordResetDto, di: string): Promise<boolean> {
        const { sessionKey, loginId, password } = authPasswordResetDto;
        // 토큰 유효기간 확인
        //const isExpired = this.isJwtTokenExpired(sessionKey);
        const isExpired = false;
        if (isExpired) {
            throw new ServiceException(MESSAGE_CODE.NICE_SESSION_KEY_EXPIRED);
        }

        // CI, DI 캐시 조회
        // const sessionData: AuthNiceSessionDataDto = await this.cacheManager.get(sessionKey);
        // if (!sessionData) {
        //     throw new ServiceException(MESSAGE_CODE.NICE_SESSION_DATA_MISSING);
        // }

        // // 캐시에서 NICE 정보 삭제
        // await this.cacheManager.del(sessionKey);

        const user = await this.userService.findEntityByDi(di);
        const isLoginIdMatch = loginId === user.loginId;
        if (!isLoginIdMatch) {
            throw new ServiceException(MESSAGE_CODE.USER_LOGIN_ID_MISMATCHED);
        }
        const isPasswordMatch = await compare(password, user.password);
        if (isPasswordMatch) {
            throw new ServiceException(MESSAGE_CODE.USER_PASSWORD_SAME);
        }
        user.password = this.hashPassword(password);
        await this.userService.save(user);
        return true;
    }

    /**
     * 비밀번호 확인
     * @param user 사용자 정보
     * @param authPasswordConfirmDto 비밀번호 확인 DTO
     */
    async confirmPassword(userDto: UserDto, authPasswordConfirmDto: AuthPasswordConfirmDto): Promise<boolean> {
        const { password } = authPasswordConfirmDto;
        const user = await this.userService.findEntityById(userDto.id);
        return await compare(password, user.password);
    }

    /**
     * 로그아웃
     * @param user 사용자 정보
     * @param uuid JWT UUID
     */
    async logout(useDto: UserDto, uuid: string): Promise<boolean> {
        const device = await this.userService.findUserDeviceByJwtUuid(uuid);
        return await this.userService.deleteUserDeviceByJwtUuid(device.jwtUuid);
    }

    /**
     * 회원 탈퇴
     * @param user 사용자 정보
     */
    async leave(userDto: UserDto): Promise<boolean> {
        await this.userService.deleteAllUserDeviceByUserId(userDto.id);
        return await this.userService.leave(userDto);
    }

    /**
     * Access Token 생성
     * @param userDto 사용자 정보
     */
    private async generateAccessToken(userDto: UserDto, uuid: string, fcmToken: string): Promise<string> {
        // 디바이스 등록
        const createUserDeviceDto: UserDeviceCreateDto = {
            fcmToken,
            jwtUuid: uuid,
            user: userDto,
        }
        await this.userService.createUserDevice(createUserDeviceDto);
        return this.jwtService.sign(
            { id: userDto.id, uuid, role: userDto.role },
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
                algorithm: 'HS256',
            }
        );
    }

    /**
     * Refresh Token 생성
     * @param userDto 사용자 정보
     */
    private async generateRefreshToken(userDto: UserDto, uuid: string): Promise<string> {
        return this.jwtService.sign(
            { id: userDto.id, uuid, role: userDto.role },
            {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
                algorithm: 'HS256',
            }
        );
    }

    /**
     * JWT 토큰 만료 여부 확인
     * @param token JWT 토큰
     */
    private isJwtTokenExpired(token: string): boolean {
        // TODO: token exp  못 읽는 에러 500 대신 수정
        const decoded = this.jwtService.decode(token);
        const exp = decoded.exp;
        const now = Math.floor(Date.now() / 1000);
        return now > exp;
    }

    /**
     * Access Token 재발급
     * @param userDto 사용자 정보
     */
    async reissueAccessToken(userDto: UserDto, refreshToken: string): Promise<AuthLoginResponseDto> {
        const user = await this.userService.findById(userDto.id);

        // 토큰 유효기간 확인
        const decoded = this.jwtService.decode(refreshToken);
        const exp = decoded.exp;
        const now = Math.floor(Date.now() / 1000);
        const remainingDays = Math.floor((exp - now) / (60 * 60 * 24));

        const userDevice = await this.userService.findUserDeviceByJwtUuid(decoded.uuid);
        // 디바이스 정보가 존재하지 않는 경우 예외 처리
        if (!userDevice) {
            throw new UnauthorizedException();
        }

        if (remainingDays < 3) {
            // 유효기간이 7일 미만인 경우 재발급
            const accessToken = await this.generateAccessToken(user, userDevice.jwtUuid, userDevice.fcmToken);
            const refreshToken = await this.generateRefreshToken(user, userDevice.jwtUuid);
            return new AuthLoginResponseDto(user, accessToken, refreshToken);
        } else {
            // 유효기간이 충분한 경우 기존 토큰 반환
            const accessToken = await this.generateAccessToken(user, userDevice.jwtUuid, userDevice.fcmToken);
            return new AuthLoginResponseDto(user, accessToken, refreshToken);
        }
    }

    /**
     * 웹 Access Token 재발급
     * @param userDto 사용자 정보
     */
    async reissueAccessTokenWeb(userDto: UserDto, refreshToken: string): Promise<[AuthLoginResponseDto, string]> {
        const authLoginResponseDto = await this.reissueAccessToken(userDto, refreshToken);

        // CSRF 토큰 생성
        const csrfToken = crypto.randomBytes(32).toString('hex');
        return [authLoginResponseDto, csrfToken];
    }

    /**
     * NICE 인증 토큰 발급
     */
    async getNiceAccessToken(): Promise<string> {
        const auth = this.clientId + ":" + this.secretKey;
        const base64Auth = Buffer.from(auth).toString('base64');

        const url = "https://svc.niceapi.co.kr:22001/digital/niceid/oauth/oauth/token";

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + base64Auth
        }

        const body = {
            'grant_type': 'client_credentials',
            'scope': 'default',
        }

        const response = await axios.post(url, body, { headers });

        if (response.status !== 200 || response.data.dataHeader.GW_RSLT_CD !== '1200') {
            throw new ServiceException(MESSAGE_CODE.NICE_ACCESS_TOKEN_ISSUANCE_FAILED);
        }

        const accessToken = response.data.dataBody.access_token;
        return accessToken;
    }

    /**
     * NICE 암호화 토큰 발급 ( Nice 표준 웹 호출을 위한 값 리턴 )
     */
    async getNiceDecodingToken(authNiceDecodingTokenIssueDto: AuthNiceDecodingTokenIssueDto): Promise<NiceEncryptionTokenDto> {
        const now = new Date();
        const accessToken = this.configService.get('NICE_ACCESS_TOKEN');
        const timestamp = Math.floor(now.getTime() / 1000);
        const auth = `${accessToken}:${timestamp}:${this.clientId}`;
        const base64Auth = Buffer.from(auth).toString('base64');

        // 요청일시 (14자리)
        const reqDtim = this.getNiceRequestDateFormat(now);

        // 요청고유번호 (30자리)
        const reqNo = uuidv4().substring(0, 30);

        // 암복호화구분(1:AES128/CBC/PKCS7)
        const encMode = '1';

        const projectId = '2101979031';

        const url = 'https://svc.niceapi.co.kr:22001/digital/niceid/api/v1.0/common/crypto/token'

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + base64Auth,
            'productID': projectId,
        }

        const body = {
            'dataHeader': {
                'CNTY_CD': 'ko',
            },
            'dataBody': {
                'req_dtim': reqDtim,
                'req_no': reqNo,
                'enc_mode': encMode,
            }
        }

        const response = await axios.post(url, body, { headers });

        if (
            response.status !== 200 ||
            response.data.dataHeader.GW_RSLT_CD !== '1200' ||
            response.data.dataBody.rsp_cd != 'P000' ||
            response.data.dataBody.result_cd !== '0000'
        ) {
            throw new ServiceException(MESSAGE_CODE.NICE_ENCRYPTION_TOKEN_ISSUANCE_FAILED);
        }

        const sitecode = response.data.dataBody.site_code;
        const tokenVersionId = response.data.dataBody.token_version_id;
        const tokenVal = response.data.dataBody.token_val;

        const result = reqDtim + reqNo + tokenVal;
        const resultVal = crypto.createHash('sha256').update(result).digest('base64');

        const key = resultVal.substring(0, 16);
        const iv = resultVal.substring(resultVal.length - 16, resultVal.length);
        const hmacKey = resultVal.substring(0, 32);

        const plain_data = {
            'requestno': reqNo,
            'returnurl': `${this.configService.get('CLIENT_IP')}/api/auth/nice/success`,
            'sitecode': sitecode
        };

        const plain = JSON.stringify(plain_data);
        const encData = this.encrypt(plain, key, iv);

        const hmac = crypto.createHmac('sha256', hmacKey);
        const integrity = hmac.update(encData).digest('base64');

        // 암호화키, 요청일시, 인증 목적 캐시에 저장
        const niceTokenVersionDataDto: NiceTokenVersionDataDto = {
            key,
            iv,
            hmacKey,
            reqNo,
            purpose: authNiceDecodingTokenIssueDto.purpose,
        }
        await this.cacheManager.set(
            tokenVersionId,
            niceTokenVersionDataDto,
            this.configService.get<number>('NICE_TOKEN_VERSION_TTL_MINUTE') * 60 * 1000
        );

        // NICE 표준창 호출을 위한 값 리턴
        const niceDecodingTokenDto: NiceEncryptionTokenDto = {
            encData,
            integrity,
            tokenVersionId
        };
        return niceDecodingTokenDto;
    }

    /**
     * NICE 인증 성공 리다이렉트용 주소
     */
    async niceSuccess(data: NiceRedirectDto): Promise<NiceSuccessDto> {
        // 인증 완료 후 기본적으로 크롬에서는 GET 그 외의 브라우저에서는 POST방식으로 데이터를 전달 하고 있습니다.
        const { token_version_id, enc_data, integrity_value } = data

        // token_version_id 비교하여 암호화 키 조회
        const encryptionKeys: NiceTokenVersionDataDto = await this.cacheManager.get(token_version_id as string);
        await this.cacheManager.del(token_version_id as string); // 사용 후 삭제

        if (!encryptionKeys) {
            throw new ServiceException(MESSAGE_CODE.NICE_ENCRYPTION_KEYS_MISSING);
        }

        const hmac = crypto.createHmac('sha256', encryptionKeys.hmacKey);
        const integrity = hmac.update(enc_data as string).digest('base64');

        if (integrity !== integrity_value) {
            throw new ServiceException(MESSAGE_CODE.NICE_INTEGRITY_MISMATCH);
        }

        // 인증 데이터 복호화
        const decryptData = JSON.parse(this.decrypt(enc_data as string, encryptionKeys.key, encryptionKeys.iv));

        if (encryptionKeys.reqNo !== decryptData.requestno) {
            throw new ServiceException(MESSAGE_CODE.NICE_SESSION_MISMATCH);
        }

        if ('0000' !== decryptData.resultcode) {
            throw new ServiceException(MESSAGE_CODE.NICE_AUTH_FAILURE);
        }

        // 회원가입 중복 확인
        if (encryptionKeys.purpose === NiceAuthRequestPurpose.Register) {
            // 중복 사용자 확인
            const isDuplicateDi = await this.userService.existsByDi(decryptData.di);
            if (isDuplicateDi) {
                throw new ServiceException(MESSAGE_CODE.USER_ALREADY_EXISTS);
            }

            // 탈퇴 이력이 있는지 확인
            const isExistRemovedDi = await this.userService.existsByDiWithDeleted(decryptData.di);
            if (isExistRemovedDi) {
                throw new ServiceException(MESSAGE_CODE.USER_REMOVED_STATUS);
            }
        }

        // 세션키 생성 및 캐시에 DI, CI 저장
        const sessionKey = this.jwtService.sign(
            { uuid: uuidv4() },
            {
                secret: this.configService.get('JWT_NICE_SESSION_KEY_SECRET'),
                expiresIn: this.configService.get('JWT_NICE_SESSION_KEY_EXPIRES_IN'),
                algorithm: 'HS256',
            }
        );
        const sessionData: AuthNiceSessionDataDto = {
            ci: decryptData.ci,
            di: decryptData.di,
            name: decodeURI(decryptData.utf8_name),
            phone: decryptData.mobileno,
            birth: decryptData.birthdate,
            gender: decryptData.gender,
        }
        await this.cacheManager.set(
            sessionKey,
            sessionData,
            this.configService.get<number>('NICE_SESSION_KEY_TTL_MINUTE') * 60 * 1000
        );

        const result: NiceSuccessDto = {
            name: sessionData.name, // 이름
            phone: sessionData.phone, // 휴대폰 번호
            birth: sessionData.birth, // 생년월일
            gender: sessionData.gender, // 성별
            sessionKey, // 세션키
        }
        return result;
    }

    /**
     * NICE 요청일시 14자리 포맷
     */
    private getNiceRequestDateFormat(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    /**
     * NICE 암호화
     */
    private encrypt(data: string, key: string, iv: string): string {
        let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }

    /**
     * NICE 복호화
     */
    private decrypt(encData: string, key: string, iv: string): string {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        const decryptedBuffers = [
            decipher.update(encData, 'base64'),
            decipher.final()
        ];
        const decrypted = Buffer.concat(decryptedBuffers).toString('utf8');
        return decrypted;
    }
}
