
export class StoreRegisterLogFileDto {
    businessRegistrationImageId: number;
    eCommerceLicenseImageId: number;
    accountImageId: number;
    profileImageId: number;
    bannerImageId: number;

    constructor(businessRegistrationImageId: number, eCommerceLicenseImageId: number, accountImageId: number, profileImageId: number, bannerImageId: number) {
        this.businessRegistrationImageId = businessRegistrationImageId;
        this.eCommerceLicenseImageId = eCommerceLicenseImageId;
        this.accountImageId = accountImageId;
        this.profileImageId = profileImageId;
        this.bannerImageId = bannerImageId;
    }
}