import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { AuthSnsProfileDto } from 'src/auth/dto/auth-sns-profile.dto';
import { UserOauthType } from 'src/user/enum/user-oauth-type.enum';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get('KAKAO_CLIENT_ID'), // CLIENT_ID
            clientSecret: configService.get('KAKAO_SECRET'), // CLIENT_SECRET
            callbackURL: `${configService.get('CLIENT_IP')}/api/auth/login/kakao/callback`, // redirect_uri
        });
    }

    async validate(	// POST /oauth/token 요청에 대한 응답이 담깁니다.
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        const { id, _json } = profile;
        const snsProfile: AuthSnsProfileDto = {
            snsUserId: id,
            email: _json.kakao_account.email,
            type: UserOauthType.Kakao,
        };
        return snsProfile;
    }
}