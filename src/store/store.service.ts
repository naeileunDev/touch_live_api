import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { StoreRepository } from './repository/store.respository';
import { MESSAGE_CODE } from 'src/common/filter/config/message-code.config';
import { ServiceException } from 'src/common/filter/exception/service.exception';
import { StoreRegisterLogDto } from './dto/store-register-log.dto';
import { plainToInstance } from 'class-transformer';
import { StoreDto } from './dto/store.dto';
import { Store } from './entity/store.entity';
import { StoreRegisterLog } from './entity/store-register-log.entity';
import { UserService } from 'src/user/service/user.service';
import { StoreRegisterStatus } from './enum/store-register-status.enum';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly userService: UserService,
  ) {
  }

  
  async create(log: StoreRegisterLog): Promise<void> {
    const useEntity = await this.userService.findEntityById(log.user.id, true);
    useEntity.storeRegisterStatus = StoreRegisterStatus.Approved;
    const savedUser = await this.userService.save(useEntity);
    const store = await this.storeRepository.createStore(log, 11);
    savedUser.store = store;
    await this.userService.save(savedUser);
    await this.storeRepository.save(store);
  }
  
  async findById(id: number): Promise<StoreDto> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new ServiceException(MESSAGE_CODE.STORE_NOT_FOUND);
    }
    return plainToInstance(StoreDto, store);
  }

  async findEntityById(id: number): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new ServiceException(MESSAGE_CODE.STORE_NOT_FOUND);
    }
    return store;
  }
  

  async save(store: Store): Promise<Store> {
    return await this.storeRepository.save(store);
  }

  async deleteById(id: number): Promise<boolean> {
    return await this.storeRepository.deleteById(id);
  }

}
