import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDeviceService } from "src/user/service/user-device.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userDeviceService: UserDeviceService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_REFRESH_SECRET'),
        });
    }

    async validate(payload: any) {
        const { id, uuid, publicId } = payload;

        if (!id || !uuid || !publicId) {
            throw new UnauthorizedException();
        }

        // 디바이스 존재 여부 확인
        const isExists = await this.userDeviceService.existsByJwtUuid(uuid);
        if(!isExists) {
            throw new UnauthorizedException();
        }

        return { id, uuid, publicId };
    }
}