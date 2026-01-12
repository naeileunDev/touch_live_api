import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReviewService } from "./review.service";
import { Controller } from "@nestjs/common";

@ApiTags('Review')
@Controller('review')
@ApiBearerAuth('access-token')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}
}