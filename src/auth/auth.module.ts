import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { GoogleStrategy } from 'src/common/strategy/google.strategy';
import { KakaoStrategy } from 'src/common/strategy/kakao.strategy';
import { NaverStrategy } from 'src/common/strategy/naver.strategy';
import { JwtRefreshStrategy } from 'src/common/strategy/jwt-refresh.strategy';
import { JwtRefreshAuthGuard } from 'src/common/guard/jwt-refresh.guard';
import { ConfigService } from '@nestjs/config';
import * as jwksClient from 'jwks-rsa';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionUtil } from 'src/common/util/encryption.util';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        GoogleStrategy,
        KakaoStrategy,
        NaverStrategy,
        JwtRefreshStrategy,
        JwtRefreshAuthGuard,
        EncryptionUtil,
        {
            provide: jwksClient.JwksClient, // JwksClient 타입 자체를 provide 합니다.
            useFactory: (configService: ConfigService) => {
                return jwksClient({
                    // Apple의 공개키 URI를 사용
                    jwksUri: configService.get<string>('APPLE_JWKS_URI')
                });
            },
            // useFactory에서 ConfigService를 사용하므로, 이를 주입(inject)합니다.
            inject: [ConfigService],
        },
    ],
    imports: [
        UserModule,
        JwtModule,
    ],
    exports: [AuthService],
})
export class AuthModule { }
