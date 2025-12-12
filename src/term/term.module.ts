import { Module } from "@nestjs/common";
import { TermController } from "./term.controller";
import { TermService } from "./term.service";
import { TermsTemplateRepository } from "./repository/terms-template.repository";

@Module({
    controllers: [TermController],
    providers: [TermService, TermsTemplateRepository],
})
export class TermModule { }