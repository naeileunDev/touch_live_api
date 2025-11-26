# ---------------------------------------
# 1. Base Stage: 공통적으로 필요한 환경 설정
# ---------------------------------------
FROM node:lts-alpine AS base
WORKDIR /usr/src/app
# pnpm 전역 설치
RUN npm install -g pnpm

# ---------------------------------------
# 2. Dependencies Stage: 의존성 설치
# ---------------------------------------
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
# 모든 의존성 설치 (빌드를 위해 devDependencies도 필요함)
RUN pnpm install --frozen-lockfile

# ---------------------------------------
# 3. Build Stage: TypeScript 빌드
# ---------------------------------------
FROM base AS build
COPY . .
# 위에서 설치한 node_modules 가져오기
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# NestJS 빌드 실행 (-> /dist 폴더 생성됨)
RUN pnpm build
# 빌드 완료 후, 운영에 필요 없는 개발 의존성 제거 (이미지 크기 감소)
RUN pnpm prune --prod

# ---------------------------------------
# 4. Production Stage: 실제 실행 이미지
# ---------------------------------------
FROM node:lts-alpine AS production
WORKDIR /usr/src/app

# PM2를 사용하신다면 설치 (선택사항: 없으면 node dist/main.js로 실행)
RUN npm install -g pm2

# 빌드 단계에서 생성된 'dist' 폴더와 정리된 'node_modules'만 복사
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

# 환경 변수 설정 (운영 모드)
ENV NODE_ENV=prod

# 실행 (PM2 사용 시 pm2-runtime 사용 권장)
CMD ["pm2-runtime", "start", "dist/main.js"]