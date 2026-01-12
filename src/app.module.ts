import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// === Common & Config Imports ===
import { ServiceExceptionFilter } from './common/filter/service-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { validationSchema } from './common/config/validation.schema';
import { dataSourceFactory, getTypeOrmConfig } from './common/config/typeorm.config';
import { EncryptionUtil } from './common/util/encryption.util';

// === Existing Feature Modules ===
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';
import { FileModule } from './file/file.module';
import { TagModule } from './tag/tag.module';
import { ShortFormModule } from './short-form/short-form.module';
import { VideoModule } from './video/video.module';
import { BannerModule } from './banner/banner.module';
import { FollowModule } from './follow/follow.module';
import { SearchModule } from './search/search.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { OrderModule } from './order/order.module';
import { CouponModule } from './coupon/coupon.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuditModule } from './audit/audit.module';
import { LikeModule } from './like/like.module';
import { ReviewModule } from './review/review.module';

@Module({
    imports: [
        // 1. Global Config Modules
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
        ScheduleModule.forRoot(),
        // 2. Feature Modules
        UserModule,
        AuthModule,
        StoreModule,
        ProductModule,
        PaymentModule,
        FileModule,
        TagModule,
        ShortFormModule,
        VideoModule,
        BannerModule,
        FollowModule,
        SearchModule,
        InquiryModule,
        OrderModule,
        CouponModule,
        AuditModule,
        LikeModule,
        ReviewModule,
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