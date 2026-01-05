import { Injectable } from "@nestjs/common";
import { UserDeviceCreateDto } from "../dto/user-device-create.dto";
import { UserDevice } from "../entities/user-device.entity";
import { UserDeviceRepository } from "../repository/user-device.repository";

@Injectable()
export class UserDeviceService {
    constructor(private readonly userDeviceRepository: UserDeviceRepository) {
    }
    /**
     * 사용자 디바이스 생성
     * @param userDeviceCreateDto 사용자 디바이스 생성 DTO
     */
    async create(userDeviceCreateDto: UserDeviceCreateDto): Promise<void> {
        const { user, jwtUuid, fcmToken } = userDeviceCreateDto;
        const maxLoginDeviceCount = parseInt(process.env.MAX_LOGIN_DEVICE_COUNT);
        const devices = await this.userDeviceRepository.findAllByUserId(user.id);

        // 리프레쉬 토큰으로 재발급인 경우에는 생성하지 않음
        const existingDevice = devices.find(device => device.jwtUuid === jwtUuid);
        if (existingDevice) {
            return;
        }

        // 기존 등록된 디바이스가 최대 허용 개수 이상일 경우 가장 오래된 디바이스 정보 업데이트
        if (devices.length >= maxLoginDeviceCount) {
            const oldestDevice = devices[devices.length - 1];
            oldestDevice.jwtUuid = jwtUuid;
            oldestDevice.fcmToken = fcmToken;
            await this.userDeviceRepository.save(oldestDevice);
            return;
        }
        
        await this.userDeviceRepository.createUserDevice(userDeviceCreateDto);
    }

    /**
     * JWT UUID로 사용자 디바이스 조회
     * @param jwtUuid 디바이스 UUID
     */
    async findByJwtUuid(jwtUuid: string): Promise<UserDevice> {
        return await this.userDeviceRepository.findByJwtUuid(jwtUuid);
    }

    /**
     * JWT UUID로 사용자 디바이스 존재 여부 확인
     * @param jwtUuid 디바이스 JWT UUID
     */
    async existsByJwtUuid(jwtUuid: string): Promise<boolean> {
        return await this.userDeviceRepository.existsByJwtUuid(jwtUuid);
    }

    /**
     * 사용자 디바이스 삭제
     * @param jwtUuid 디바이스 JWT UUID
     */
    async deleteByJwtUuid(jwtUuid: string): Promise<boolean> {
        return await this.userDeviceRepository.deleteByJwtUuid(jwtUuid);
    }

    /**
     * 사용자 식별자로 모든 디바이스 삭제
     * @param userId 사용자 식별자
     */
    async deleteAllByUserId(userId: string): Promise<boolean> {
        return await this.userDeviceRepository.deleteAllByUserId(userId);
    }
}