import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { UserOauthRepository } from './repository/user-oauth.repository';
import { UserDeviceRepository } from './repository/user-device.repository';
import { UserSignupSourceDataRepository } from './repository/user-signup-source-data.repository';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
        UserOauthRepository,
        UserDeviceRepository,
        UserSignupSourceDataRepository,
    ],
    exports: [UserService],
})
export class UserModule { }
