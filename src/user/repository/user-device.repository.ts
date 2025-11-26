import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, In, Repository } from "typeorm";
import { UserDevice } from "../entity/user-device.entity";
import { UserDeviceCreateDto } from "../dto/user-device-create.dto";

@Injectable()
export class UserDeviceRepository extends Repository<UserDevice> {
    constructor(private dataSource: DataSource) {
        super(UserDevice, dataSource.createEntityManager());
    }

    async createUserDevice(userDeviceCreateDto: UserDeviceCreateDto): Promise<UserDevice> {
        const userDevice = this.create(userDeviceCreateDto);
        await this.save(userDevice);
        return userDevice;
    }

    async findAllByUserId(userId: number): Promise<UserDevice[]> {
        return await this.find({
            where: {
                user: {
                    id: userId,
                },
            },
            order: {
                createdAt: 'DESC'
            }
        });
    }

    async findByJwtUuid(jwtUuid: string): Promise<UserDevice> {
        return await this.findOne({
            where: {
                jwtUuid,
            },
        });
    }

    async existsByJwtUuid(jwtUuid: string): Promise<boolean> {
        return await this.exists({
            where: {
                jwtUuid,
            },
        });
    }

    // fcmToken 중복 제거 조회 / fcmToken이 없는 경우 제외
    async findDistinctFcmTokensByUserId(userId: number): Promise<string[]> {
        const queryBuilder = this.createQueryBuilder('user_device')
            .distinctOn(['user_device.fcmToken'])
            .select(['user_device.fcmToken'])
            .where('user_device.userId = :userId', { userId })
            .andWhere('user_device.fcmToken IS NOT NULL')
            .distinct();

        const userDevices = await queryBuilder.getMany();
        return userDevices.map((device) => device.fcmToken);
    }

    async deleteByTokens(tokens: string[]): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            fcmToken: In(tokens),
        });
        return rtn.affected === tokens.length;
    }

    async deleteByJwtUuid(jwtUuid: string): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            jwtUuid,
        });
        return rtn.affected > 0;
    }

    async deleteAllByUserId(userId: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            user: {
                id: userId,
            },
        });
        return rtn.affected > 0;
    }
}