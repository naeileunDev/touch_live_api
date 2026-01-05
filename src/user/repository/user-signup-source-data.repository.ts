import { DataSource, Repository } from "typeorm";
import { UserSignupSourceData } from "../entity/user-signup-surce-data.entity";
import { Injectable } from "@nestjs/common";
import { UserSignupSourceDto } from "../dto/user-signup-source.dto";
import { User } from "../entity/user.entity";

@Injectable()
export class UserSignupSourceDataRepository extends Repository<UserSignupSourceData> {
    constructor(private dataSource: DataSource) {
        super(UserSignupSourceData, dataSource.createEntityManager());
    }

    async createUserSignupSourceData(createDto: UserSignupSourceDto, user: User): Promise<UserSignupSourceData> {
        const data = this.create({
            category: createDto.category,
            etcDescription: createDto.etcDescription,
            user: user,
        });
        return await this.save(data);
    }

}