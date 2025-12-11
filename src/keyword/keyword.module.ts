import { Module } from "@nestjs/common";
import { KeywordController } from "./keyword.controller";
import { KeywordService } from "./keyword.service";
import { KeywordRepository } from "./repository/keyword.repository";

@Module({
    controllers: [KeywordController],
    providers: [KeywordService, KeywordRepository],
})
export class KeywordModule { }