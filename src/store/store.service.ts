import { Injectable } from '@nestjs/common';
import { StoreCreateDto } from './dto/store-create.dto';
import { User } from 'src/user/entity/user.entity';
import { StoreRepository } from './repository/store.respository';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {
  }
  create(storeCreateDto: StoreCreateDto, user: User) {
    return ;
  }
}
