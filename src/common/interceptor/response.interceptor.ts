import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_KEY } from '../decorator/swagger/response-message.decorator';

export interface IResponse<T> {
    data: T;
    message: any;
    statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, IResponse<T>> {
    private statusCode: number;

    constructor(private readonly reflector: Reflector) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<IResponse<T>>> {

        this.statusCode = context.switchToHttp().getResponse<Response>().statusCode;

        // 메타데이터에서 메시지 가져오기
        const message = this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
        ) || 'SUCCESS';

        return next.handle().pipe(
            map((data) => {
                return {
                    statusCode: this.statusCode,
                    message,
                    data,
                };
            }),
        );
    }
}