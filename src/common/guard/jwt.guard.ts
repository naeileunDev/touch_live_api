import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        // 토큰 있는지 확인
        const request = context.switchToHttp().getRequest();
        const headers = request.headers.authorization ?? '';

        if (roles.length == 0 && !headers.includes('Bearer')) {
            return true; // ANY_PERMISSION인 경우 토큰이 없어도 접근 허용
        }

        // 기본 AuthGuard 동작 수행
        return super.canActivate(context) as boolean;
    }
}