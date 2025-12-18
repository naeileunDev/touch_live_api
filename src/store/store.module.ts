import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreRepository } from './repository/store.respository';
import { FileModule } from 'src/file/file.module';

@Module({
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
  imports: [FileModule],
})
export class StoreModule {}
