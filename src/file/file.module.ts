import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileRepository } from './repository/file.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [FileController],
  providers: [FileService, FileRepository],
  exports: [FileService],
})
export class FileModule {}
