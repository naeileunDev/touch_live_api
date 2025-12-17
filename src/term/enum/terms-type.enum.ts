export enum TermsType {
    // 필수 서비스 이용약관
    Commercial = 'COMMERCIAL',
    Service = 'SERVICE', // ', //서비스 이용 및 수익 모델 정책 이용약관
    UgcSystem = 'UGC_SYSTEM', // 유저 생성 콘텐츠 생태계 운영 약관 
    Finance = 'FINANCE', // 전자금융거래 이용동의

    // 선택 
    Location = 'LOCATION', // 위치기반 이용약관
    MARKETING = 'MARKETING', // 마케팅 정보 수신 동의
    THIRDPARTY = 'THIRDPARTY', // 개인정보 제3자 제공 동의
}