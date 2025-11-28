import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
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
  synchronize: configService.get<boolean>('DB_SYNCHRO'),
  ssl:
  configService.get<string>('NODE_ENV') === 'prod'
      ? { rejectUnauthorized: false }
      : false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  extra: {
    timezone: 'Asia/Seoul',
  },
});

export const getDataSourceFactory = () => {
  return async (options: DataSourceOptions) => {
    const dataSource = new DataSource(options);
    try {
      return addTransactionalDataSource(dataSource);
    } catch (error: any) {
      // 이미 추가된 DataSource인 경우 기존 DataSource 반환
      if (error.message && error.message.includes('has already added')) {
        return dataSource;
      }
      throw error;
    }
  };
};

