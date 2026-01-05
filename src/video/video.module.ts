import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoViewLog, VideoLike, VideoComment, VideoCommentLike } from './entity/video.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VideoViewLog,
            VideoLike,
            VideoComment,
            VideoCommentLike,
        ]),
    ],
    controllers: [VideoController],
    providers: [VideoService],
    exports: [VideoService],
})
export class VideoModule {}
