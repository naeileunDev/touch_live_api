import { PartialType } from '@nestjs/swagger';
import { StoreRegisterLogCreateDto } from './store-register-log-create.dto';

export class UpdateStoreDto extends PartialType(StoreRegisterLogCreateDto) {}
