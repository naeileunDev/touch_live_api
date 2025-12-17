import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { StoreRepository } from './repository/store.respository';

@Module({
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
})
export class StoreModule {}
