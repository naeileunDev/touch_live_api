import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserDeviceService } from 'src/user/service/user-device.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userDeviceService: UserDeviceService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const { id, publicId, uuid, role, storeRegisterStatus, storeId, operatorRole } = payload;
        console.log("payload", payload.uuid);
        if (!id || !publicId || !uuid || !role) {
            throw new UnauthorizedException();
        }

        // 디바이스 존재 여부 확인
        const isExists = await this.userDeviceService.existsByJwtUuid(uuid);
        if(!isExists) {
            throw new UnauthorizedException();
        }

        return { id, publicId, uuid, role, storeRegisterStatus, storeId, operatorRole };
    }
}
