import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { AuthSnsProfileDto } from 'src/auth/dto/auth-sns-profile.dto';
import { UserOauthType } from 'src/user/enum/user-oauth-type.enum';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get('NAVER_CLIENT_ID'), // CLIENT_ID
            clientSecret: configService.get('NAVER_SECRET'), // CLIENT_SECRET
            callbackURL: `${configService.get('CLIENT_IP')}/api/auth/login/naver/callback`, // redirect_uri
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        const { id, _json } = profile;
        const snsProfile: AuthSnsProfileDto = {
            snsUserId: id,
            email: _json.email,
            type: UserOauthType.Naver
        };
        return snsProfile;
    }
}