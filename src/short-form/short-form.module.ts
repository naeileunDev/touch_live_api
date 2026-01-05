import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortFormController } from './short-form.controller';
import { ShortFormService } from './short-form.service';
import { ShortFormRecommendationService } from './short-form-recommendation.service';
import { ShortForm } from './entity/short-form.entity';
import { ShortFormTag } from './entity/short-form-tag.entity';

// 추천 알고리즘에 필요한 외부 엔티티
import { VideoViewLog } from 'src/video/entity/video.entity';
import { UserFollow } from 'src/follow/entity/user-follow.entity';
import { User } from 'src/user/entity/user.entity';
import { SearchHistory } from 'src/search/entity/search-history.entity';
import { ShortFormProductTag } from './entity/short-form-product-tag.entity';

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
