import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { UserFollowService } from './service/user-follow.service';
import { UserFollowRepository } from './repository/user-follow.repository';
import { UserModule } from 'src/user/user.module';
import { StoreFollowRepository } from './repository/store-follow.repository';
import { StoreModule } from 'src/store/store.module';

@Module({
    imports: [UserModule, StoreModule],
    controllers: [FollowController],
    providers: [UserFollowService, UserFollowRepository, StoreFollowRepository],
    exports: [UserFollowService],
})
export class FollowModule {}
