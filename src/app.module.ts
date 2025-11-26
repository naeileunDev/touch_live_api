import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServiceExceptionFilter } from './common/filter/service-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`.${process.env.NODE_ENV}.env`],
        }),
        CacheModule.register({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: configService.get<string>('DB_TYPE') as 'postgres',
                    host: configService.get<string>('DB_HOST'),
                    port: parseInt(configService.get<string>('DB_PORT')),
                    username: configService.get<string>('DB_USER'),
                    password: configService.get<string>('DB_PASSWORD'),
                    database: configService.get<string>('DB_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                    timezone: 'local', // 타임존 설정'
                    ssl:
                        configService.get<string>('NODE_ENV') === 'prod'
                            ? { rejectUnauthorized: false }
                            : false,
                };
            },
            async dataSourceFactory(option) {
                if (!option) throw new Error('Invalid options passed');

                return addTransactionalDataSource(new DataSource(option));
            },
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        Logger,
        {
            provide: APP_FILTER,
            useClass: ServiceExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*');
    }
}
