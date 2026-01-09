import { Module } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { AuditRequestRepository } from "./repository/audit-request.repository";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [UserModule],
    controllers: [],
    providers: [AuditService, AuditRequestRepository],
})
export class AuditModule {
}