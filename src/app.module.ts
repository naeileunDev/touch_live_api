import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServiceExceptionFilter } from './common/filter/service-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { validationSchema } from './common/config/validation.schema';
import { dataSourceFactory, getTypeOrmConfig } from './common/config/typeorm.config';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { EncryptionUtil } from './common/util/encryption.util';
import { FileModule } from './file/file.module';
import { TagModule } from './tag/tag.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.${process.env.NODE_ENV}.env`,
            validationSchema: validationSchema,
        }),
        CacheModule.register({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: getTypeOrmConfig,
            dataSourceFactory: dataSourceFactory,
        }),
        UserModule,
        AuthModule,
        StoreModule,
        ProductModule,
        PaymentMethodModule,
        FileModule,
        TagModule,
    ],
    controllers: [],
    providers: [
        EncryptionUtil,
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
