import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { UserOauthRepository } from './repository/user-oauth.repository';
import { UserDeviceRepository } from './repository/user-device.repository';
import { UserSignupSourceDataRepository } from './repository/user-signup-source-data.repository';
import { UserTermsAgreementRepository } from './repository/user-terms-agreement.repository';
import { UserAddressRepository } from './repository/user-address-repository';
import { UserDeviceService } from './service/user-device.service';
import { UserAddressService } from './service/user-address.service';
import { UserOauthService } from './service/user-oauth.service';
import { EncryptionUtil } from 'src/common/util/encryption.util';
import { UserOperationRepository } from './repository/user-operation-repository';
import { UserOperationService } from './service/user-operation.service';
import { UserCiRepository } from './repository/user-ci.repository';
import { UserDiRepository } from './repository/user-di.repository';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        UserAddressService,
        UserOperationService,
        UserOauthService,
        UserDeviceService,
        UserRepository,
        UserOauthRepository,
        UserDeviceRepository,
        UserSignupSourceDataRepository,
        UserTermsAgreementRepository,
        UserAddressRepository,
        EncryptionUtil,
        UserOperationRepository,
        UserCiRepository,
        UserDiRepository,
    ],
    exports: [UserService, UserOperationService, UserOauthService, UserDeviceService],
})
export class UserModule { }
