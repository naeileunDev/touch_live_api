import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthSnsProfileDto } from 'src/auth/dto/auth-sns-profile.dto';
import { UserOauthType } from 'src/user/enum/user-oauth-type.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'), // CLIENT_ID
            clientSecret: configService.get('GOOGLE_SECRET'), // CLIENT_SECRET
            callbackURL: `${configService.get('CLIENT_IP')}/api/auth/login/google/callback`, // redirect_uri
            passReqToCallback: true,
            scope: ['email', 'profile'], // 가져올 정보들
        });
    }

    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ) {
        const { id, emails } = profile;
        const snsProfile: AuthSnsProfileDto = {
            snsUserId: id,
            email: emails[0].value,
            type: UserOauthType.Google
        };
        return snsProfile;
    }
}