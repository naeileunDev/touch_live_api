import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreRepository } from './repository/store.respository';
import { FileModule } from 'src/file/file.module';
import { StoreRegisterLogRepository } from './repository/store-register-log.repository';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { StoreMediaRepository } from './repository/store-media.repository';
import { StoreRegisterLogService } from './store-register-log.service';

@Module({
  controllers: [StoreController],
  providers: [
    StoreService, 
    StoreRepository, 
    StoreRegisterLogRepository, 
    StoreMediaRepository,
    StoreRegisterLogService,
  ],
  imports: [FileModule, UserModule, AuthModule],
  exports: [StoreService],
})
export class StoreModule {}
