import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StoreRegisterStatus } from 'src/store/enum/store-register-status.enum';
import { ServiceException } from '../filter/exception/service.exception';
import { MESSAGE_CODE } from '../filter/config/message-code.config';

@Injectable()
export class StoreOwnerGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requireStore = this.reflector.get<boolean>(
            'requireStore',
            context.getHandler(),
        );

        const requireNoStore = this.reflector.get<boolean>(
            'requireNoStore',
            context.getHandler(),
        );

        if (!requireStore && !requireNoStore) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user as {
            storeId?: number | null;
            storeRegisterStatus?: StoreRegisterStatus | null;
        };

        console.log(user);

        if (requireStore) {
            if (!user.storeId) {
                throw new ServiceException(MESSAGE_CODE.STORE_OWNER_ONLY);
            }        
        }
        else if (requireNoStore) {
            console.log(user.storeRegisterStatus);
            if (user.storeId) {
                throw new ServiceException(MESSAGE_CODE.STORE_NON_OWNER_ONLY);
            }
            else if (user.storeRegisterStatus && user.storeRegisterStatus === StoreRegisterStatus.Rejected) {
                return true;
            }
            else if (user.storeRegisterStatus && user.storeRegisterStatus === StoreRegisterStatus.Pending) {
                throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_STATUS_PENDING);
            }
            else if (user.storeRegisterStatus && user.storeRegisterStatus === StoreRegisterStatus.Approved) {
                throw new ServiceException(MESSAGE_CODE.STORE_REGISTER_STATUS_APPROVED);
            }
        }
        return true;
    }
}