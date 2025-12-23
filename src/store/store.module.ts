import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreRepository } from './repository/store.respository';
import { FileModule } from 'src/file/file.module';
import { StoreRegisterLogRepository } from './repository/store-register-log.repository';
import { TagModule } from 'src/tag/tag.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [StoreController],
  providers: [StoreService, StoreRepository, StoreRegisterLogRepository],
  imports: [FileModule, TagModule, UserModule, AuthModule],
})
export class StoreModule {}
