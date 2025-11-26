import { Inject, Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
        @Inject(Logger) private readonly logger: LoggerService,
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        const { ip, method, originalUrl, headers } = req;

        const now = new Date();
        res.on('finish', () => {
            if (originalUrl == '/api') { // health check 로그 기록 제외
                return;
            }
            const user = req.user as any
            const logData = {
                userId: user?.id ?? 'Anonymous',
                url: `${method} ${originalUrl} ${res.statusCode}`,
                time: now.toISOString(),
                ip: ip,
                responseTimeMs: Date.now() - now.getTime(),
            };

            // LoggerService의 log 메서드를 사용하여 객체 전체를 기록
            this.logger.log(logData, 'RequestLogger');
        });

        next();
    }
}