import { Injectable } from "@nestjs/common";
import { Keyword } from "aws-sdk/clients/networkfirewall";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class KeywordRepository extends Repository<Keyword> {
    constructor(
        private readonly dataSource: DataSource
    ) {
    }
}