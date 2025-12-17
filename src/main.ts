import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { winstonLogger } from './common/logger/winston.config';

const users = {
    [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
};

async function bootstrap() {
    initializeTransactionalContext(); // Initialize TypeORM transaction

    const app = await NestFactory.create(AppModule, {
        logger: winstonLogger,
    });

    // API 접두사 설정
    app.setGlobalPrefix('api/v1');

    // CORS 허용
    app.enableCors({
        origin: true, // 허용할 출처
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드
        credentials: true, // 쿠키와 인증 정보를 포함하도록 설정
    });

    // DTO validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    /// Swaager 설정
    const config = new DocumentBuilder()
        .setTitle('Touch Live API')
        .setDescription('Touch Live API description')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                name: 'JWT',
                in: 'header',
            },
            'access-token',
        )
        .build();

    app.use(['/api/docs'], expressBasicAuth({ challenge: true, users }));

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);

    if (document.components?.schemas) {
        Object.keys(document.components.schemas).forEach(key => {
            if (
                key.startsWith('SuccessResponseWrapper')  
                || key === 'Boolean'
                || key === 'String'
            ) {
                delete document.components.schemas[key];
            }
        });
    }

    await app.listen(3000);
}
bootstrap();
