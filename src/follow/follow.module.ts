import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowController } from './follow.controller';
import { UserFollowService } from './service/user-follow.service';
import { UserFollowRepository } from './repository/user-follow.repository';
import { UserModule } from 'src/user/user.module';
import { StoreFollowRepository } from './repository/store-follow.repository';

@Module({
    imports: [UserModule],
    controllers: [FollowController],
    providers: [UserFollowService, UserFollowRepository, StoreFollowRepository],
    exports: [UserFollowService],
})
export class FollowModule {}
