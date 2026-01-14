import { Module } from "@nestjs/common";
import { TermController } from "./term.controller";
import { TermService } from "./service/term.service";
import { TermVersionRepository } from "./repository/term-version.repository";
import { UserTermAgreementChangeLogRepository } from "./repository/user-term-agreement-change-log.repository";
import { StoreTermAgreementChangeLogRepository } from "./repository/store-term-agreement-change-log.repository";

@Module({
    controllers: [TermController],
    providers: [
        TermService, 
        TermVersionRepository,
        UserTermAgreementChangeLogRepository,
        StoreTermAgreementChangeLogRepository,
    ],
    exports: [TermService],
})
export class TermModule {
}