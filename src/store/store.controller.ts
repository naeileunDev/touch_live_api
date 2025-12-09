import { Controller, Post, Body} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/common/decorator/role.decorator';
import { USER_PERMISSION } from 'src/common/permission/permission';
import { NonStoreOwner } from 'src/common/decorator/store-owner.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {
  }

  @Post()
  @Role(USER_PERMISSION)
  @NonStoreOwner()
  @ApiBearerAuth('access-token')
  create(@Body() createStoreDto: CreateStoreDto, @GetUser() user: User) {
    const store = this.storeService.create(createStoreDto, user);
    return store;
  }
}

