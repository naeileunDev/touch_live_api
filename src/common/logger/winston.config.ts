import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file'; // 수정된 부분

const isProd = process.env.NODE_ENV == 'prod';
const dailyOptions = (level: string) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: `${__dirname}/../../../logs/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 3,
    };
};

// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: isProd ? 'info' : 'silly',
            format: isProd
                ? winston.format.simple()
                : winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.ms(),
                    utilities.format.nestLike('touch-live-sevice', {
                        colors: true,
                        prettyPrint: true,
                    }),
                ),
        }),
        /// 이 레벨들만 파일로 관리
        new DailyRotateFile(dailyOptions('info')),
        new DailyRotateFile(dailyOptions('warn')),
        new DailyRotateFile(dailyOptions('error')),
    ],
});