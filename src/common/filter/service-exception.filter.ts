import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { ServiceException } from "./exception/service.exception";

@Catch() // 모든 예외 타입을 잡도록 설정
export class ServiceExceptionFilter implements ExceptionFilter {
    private readonly logger: Logger = new Logger(ServiceExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        let statusCode: number;
        let code: number;
        let message: string;

        // ServiceException 처리
        if (exception instanceof ServiceException) {
            code = exception.statusCode;
            statusCode = code < 1000 ? code : 409; // 1000 이상은 내부 코드이므로 409로 매핑
            message = exception.message || 'Service Error';
        }
        // NestJS HttpException 처리
        else if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            code = statusCode;
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string' 
                ? exceptionResponse 
                : (exceptionResponse as any)?.message || exception.message || 'HTTP Error';
        }
        // 알 수 없는 예외 처리
        else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            code = statusCode;
            message = 'Internal Server Error';
        }

        // 에러 로그 기록 (공통 구조)
        const logPayload = {
            datetime: new Date(),
            statusCode,
            code,
            message,
            stack: exception?.stack || '',
            exceptionType: exception?.constructor?.name || 'Unknown',
            url: request.url,
            method: request.method,
            params: request.params,
            query: request.query,
            body: request.body,
        };

        if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(logPayload);
        } else {
            this.logger.warn(logPayload);
        }

        response.status(statusCode).json({
            statusCode,
            message: 'FAILED',
            data: {
                code,
                message,
            },
        });
    }
}
