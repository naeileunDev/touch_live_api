import { DataSource, Repository } from "typeorm";
import { Review } from "../entity/review.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReviewRepository extends Repository<Review> {
    constructor(private readonly dataSource: DataSource) {
        super(Review, dataSource.createEntityManager());
    }
}