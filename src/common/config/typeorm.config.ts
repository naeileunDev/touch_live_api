import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

export const getTypeOrmConfig = (
    configService: ConfigService,
  ): TypeOrmModuleOptions => ({
      type: configService.get('DB_TYPE') as 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      database: configService.get<string>('DB_NAME'),
      username: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      replication: {
        master: {
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          database: configService.get<string>('DB_NAME'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
        },
        slaves: [
            {
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            database: configService.get<string>('DB_NAME'),
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            },
        ]},
      synchronize: configService.get<boolean>('DB_SYNCHRO'),
      ssl: configService.get<string>('NODE_ENV') === 'prod' ? { rejectUnauthorized: false } : false,
      // 빌드 후 dist 폴더 기준으로 경로 수정
      entities: [join(__dirname, '../../**/*.entity.{js,ts}')],
      extra: { timezone: 'local' },
  });

export const dataSourceFactory = async (option) => {
    if (!option) throw new Error('Invalid options passed');

    return addTransactionalDataSource(new DataSource(option));
};

