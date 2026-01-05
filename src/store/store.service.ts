import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { StoreRepository } from './repository/store.respository';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { StoreRegisterLogDto } from './dto/store-register-log.dto';
import { plainToInstance } from 'class-transformer';
import { StoreDto } from './dto/store.dto';
import { Store } from './entity/store.entity';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
  ) {
  }

  
  async createStore(createDto: StoreRegisterLogDto, user: User): Promise<StoreDto> {
    const store = await this.storeRepository.createStore(createDto, user, 11);
    return plainToInstance(StoreDto, store);
  }
  
  async findByStoreId(id: number): Promise<StoreDto> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new ServiceException(MESSAGE_CODE.STORE_NOT_FOUND);
    }
    return plainToInstance(StoreDto, store);
  }

  async findEntityByStoreId(id: number): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new ServiceException(MESSAGE_CODE.STORE_NOT_FOUND);
    }
    return store;
  }
  

  async saveStore(store: Store): Promise<Store> {
    return await this.storeRepository.save(store);
  }

  async deleteByStoreId(id: number): Promise<boolean> {
    return await this.storeRepository.deleteById(id);
  }

}
