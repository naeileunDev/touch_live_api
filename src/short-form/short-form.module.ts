import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortFormController } from './short-form.controller';
import { ShortFormService } from './short-form.service';
import { ShortFormRecommendationService } from './short-form-recommendation.service';
import { ShortForm } from './entities/short-form.entity';
import { ShortFormProductTag } from './entities/short-form-product-tag.entity';
import { ShortFormTag } from './entities/short-form-tag.entity';

// 추천 알고리즘에 필요한 외부 엔티티
import { VideoViewLog } from 'src/video/entities/video.entity';
import { SearchHistory } from 'src/search/entities/search-history.entity';
import { UserFollow } from 'src/follow/entities/user-follow.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ShortForm,
            ShortFormProductTag,
            ShortFormTag,
            VideoViewLog,
            SearchHistory,
            UserFollow,
            User,
        ]),
    ],
    controllers: [ShortFormController],
    providers: [
        ShortFormService,
        ShortFormRecommendationService,
    ],
    exports: [
        ShortFormService,
        ShortFormRecommendationService,
    ],
})
export class ShortFormModule {}
