import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const { id, uuid, role, storeRegisterStatus, storeId, operatorRole } = payload;
        if (!id || !uuid || !role) {
            throw new UnauthorizedException();
        }

        // 디바이스 존재 여부 확인
        const isExists = await this.userService.existsDeviceByJwtUuid(uuid);
        if(!isExists) {
            throw new UnauthorizedException();
        }

        return { id, uuid, role, storeRegisterStatus, storeId, operatorRole };
    }
}
