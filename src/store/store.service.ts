import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { User } from 'src/user/entity/user.entity';
import { StoreRepository } from './repository/store.respository';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {
  }
  create(createStoreDto: CreateStoreDto, user: User) {
    return 'This action adds a new store';
  }
}
