import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface IResponse<T> {
    data: T;
    message: any;
    statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, IResponse<T>> {
    private statusCode: number;


    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<IResponse<T>>> {

        this.statusCode = context.switchToHttp().getResponse<Response>().statusCode;

        return next.handle().pipe(
            map((data) => {
                return {
                    statusCode: this.statusCode,
                    message: 'SUCCESS',
                    data,
                };
            }),
        );
    }
}
