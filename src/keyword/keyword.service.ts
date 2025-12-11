import { Injectable } from "@nestjs/common";
import { KeywordRepository } from "./repository/keyword.repository";

@Injectable()
export class KeywordService {
    constructor(
        private readonly keywordRepository: KeywordRepository
    ) {
    }
}