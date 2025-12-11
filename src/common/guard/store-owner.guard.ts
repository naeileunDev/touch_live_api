import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StoreRegisterStatus } from 'src/store/enum/store-register-status.enum';

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
        // @ts-ignore
        const { user } = request;
        const hasStore =  user.store != null;
        const storeRegisterStatus = (
        user.storeRegisterStatus === StoreRegisterStatus.Pending || 
        user.storeRegisterStatus === StoreRegisterStatus.Approved
        );

        if (requireStore && !hasStore) {
            throw new ForbiddenException('스토어 소유자만 접근 가능합니다.');
        }

        if (requireNoStore && hasStore) {
            throw new ForbiddenException('스토어 미소유자만 접근 가능합니다.');
        }
        else if (requireNoStore && !hasStore && storeRegisterStatus && user.storeRegisterStatus === StoreRegisterStatus.Pending) {
            throw new ForbiddenException('스토어 등록 대기 중입니다');
        }

        return true;
    }
}