import { StoreFollowRepository } from "../repository/store-follow.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StoreFollowService {
    constructor(
        private readonly storeFollowRepository: StoreFollowRepository) {
        }
}