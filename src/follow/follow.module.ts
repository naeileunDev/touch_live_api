import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { UserFollow } from './entity/user-follow.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserFollow])],
    controllers: [FollowController],
    providers: [FollowService],
    exports: [FollowService],
})
export class FollowModule {}
