import { PartialType } from '@nestjs/swagger';
import { FileCreateDto } from './file-create.dto';

export class UpdateFileDto extends PartialType(FileCreateDto) {}
