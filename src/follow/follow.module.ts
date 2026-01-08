import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { UserFollow } from './entity/user-follow.entity';
import { StoreFollow } from './entity/store-follow.entity';
import { StoreFollowRepository } from './repository/store-follow.repository';
import { UserFollowRepository } from './repository/user-follow.repository';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [FollowController],
    providers: [FollowService, UserFollowRepository, StoreFollowRepository],
    exports: [FollowService],
})
export class FollowModule {}
