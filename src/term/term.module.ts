import { Module } from "@nestjs/common";
import { TermController } from "./term.controller";
import { TermService } from "./service/term.service";
import { TermVersionRepository } from "./repository/term-version.repository";
import { UserModule } from "src/user/user.module";
import { UserTermAgreementChangeLogRepository } from "./repository/user-term-agreement-change-log.repository";
import { StoreTermAgreementChangeLogRepository } from "./repository/store-term-agreement-change-log.repository";

@Module({
    imports: [UserModule],
    controllers: [TermController],
    providers: [
        TermService, 
        TermVersionRepository,
        UserTermAgreementChangeLogRepository,
        StoreTermAgreementChangeLogRepository,
    ],
})
export class TermModule {
}