import { PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './store-create.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
