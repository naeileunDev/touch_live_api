import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TermVersion } from "../entity/term-version.entity";

@Injectable()
export class TermVersionRepository extends Repository<TermVersion> {
    constructor(private dataSource: DataSource) {
        super(TermVersion, dataSource.createEntityManager());
    }
}