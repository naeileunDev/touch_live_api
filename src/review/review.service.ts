import { ReviewRepository } from "./repository/review.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReviewService {
    constructor(private readonly reviewRepository: ReviewRepository) {}
}