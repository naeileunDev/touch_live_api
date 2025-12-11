import { PartialType } from '@nestjs/swagger';
import { StoreCreateDto } from './store-create.dto';

export class UpdateStoreDto extends PartialType(StoreCreateDto) {}
