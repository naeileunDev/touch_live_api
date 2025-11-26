# 도메인 생성 가이드

이 가이드는 프로젝트의 `user` 도메인과 동일한 구조로 새로운 도메인을 생성하는 규칙을 설명합니다.

## 📋 목차

1. [생성할 파일 목록](#생성할-파일-목록)
2. [파일 생성 규칙](#파일-생성-규칙)
3. [예시: `product` 도메인 생성](#예시-product-도메인-생성)
4. [파일별 템플릿](#파일별-템플릿)

---

## 생성할 파일 목록

도메인명(예: `product`)을 주면 다음 파일들을 생성해야 합니다:

```
src/{도메인명}/
├── entity/
│   └── {도메인명}.entity.ts
├── repository/
│   └── {도메인명}.repository.ts
├── dto/
│   ├── {도메인명}.dto.ts
│   └── {도메인명}-create.dto.ts
├── {도메인명}.service.ts
├── {도메인명}.module.ts
└── {도메인명}.controller.ts
```

**예시**: `product` 도메인 생성 시
```
src/product/
├── entity/
│   └── product.entity.ts
├── repository/
│   └── product.repository.ts
├── dto/
│   ├── product.dto.ts
│   └── product-create.dto.ts
├── product.service.ts
├── product.module.ts
└── product.controller.ts
```

---

## 파일 생성 규칙

### 1. Entity (`{도메인명}.entity.ts`)

**위치**: `src/{도메인명}/entity/{도메인명}.entity.ts`

**규칙**:
- `BaseEntity`를 **반드시 extends** 해야 함
- `@Entity()` 데코레이터 필수
- TypeORM `Column` 데코레이터 사용

**템플릿**:
```typescript
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class {도메인명_첫글자_대문자} extends BaseEntity {
    // 여기에 도메인별 필드 추가
    @Column({ type: 'varchar', length: 255, comment: '설명' })
    fieldName: string;
}
```

---

### 2. Repository (`{도메인명}.repository.ts`)

**위치**: `src/{도메인명}/repository/{도메인명}.repository.ts`

**규칙**:
- `@Injectable()` 데코레이터 필수
- `Repository<Entity>`를 extends
- `DataSource`를 constructor에서 주입
- 기본 CRUD 메서드 구현:
  - `create{도메인명}(dto)`: 생성
  - `findById(id)`: ID로 조회
  - `deleteById(id)`: 소프트 삭제

**템플릿**:
```typescript
import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { {도메인명_첫글자_대문자} } from "../entity/{도메인명}.entity";
import { {도메인명_첫글자_대문자}CreateDto } from "../dto/{도메인명}-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class {도메인명_첫글자_대문자}Repository extends Repository<{도메인명_첫글자_대문자}> {
    constructor(private dataSource: DataSource) {
        super({도메인명_첫글자_대문자}, dataSource.createEntityManager());
    }

    async create{도메인명_첫글자_대문자}(createDto: {도메인명_첫글자_대문자}CreateDto): Promise<{도메인명_첫글자_대문자}> {
        const entity = this.create(createDto);
        await this.save(entity);
        return entity;
    }

    async findById(id: number): Promise<{도메인명_첫글자_대문자}> {
        const entity = await this.findOne({
            where: {
                id,
            },
        });
        if (!entity) {
            throw new ServiceException(MESSAGE_CODE.{도메인명_대문자}_NOT_FOUND);
        }
        return entity;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }
}
```

---

### 3. Service (`{도메인명}.service.ts`)

**위치**: `src/{도메인명}/{도메인명}.service.ts`

**규칙**:
- `@Injectable()` 데코레이터 필수
- Repository를 constructor에서 주입
- 기본 CRUD 메서드 구현:
  - `create(dto)`: 생성 (DTO 반환)
  - `findById(id)`: ID로 조회 (DTO 반환)
  - `findEntityById(id)`: ID로 조회 (Entity 반환, 비밀번호 등 민감 정보 포함)
  - `save(entity)`: 저장 (DTO 반환)
  - `deleteById(id)`: 삭제

**템플릿**:
```typescript
import { Injectable } from '@nestjs/common';
import { {도메인명_첫글자_대문자}Repository } from './repository/{도메인명}.repository';
import { {도메인명_첫글자_대문자} } from './entity/{도메인명}.entity';
import { {도메인명_첫글자_대문자}Dto } from './dto/{도메인명}.dto';
import { {도메인명_첫글자_대문자}CreateDto } from './dto/{도메인명}-create.dto';

@Injectable()
export class {도메인명_첫글자_대문자}Service {
    constructor(
        private readonly {도메인명}Repository: {도메인명_첫글자_대문자}Repository,
    ) { }

    /**
     * {도메인명_한글} 생성
     * @param createDto {도메인명_한글} 생성 정보
     */
    async create(createDto: {도메인명_첫글자_대문자}CreateDto): Promise<{도메인명_첫글자_대문자}Dto> {
        const entity = await this.{도메인명}Repository.create{도메인명_첫글자_대문자}(createDto);
        return new {도메인명_첫글자_대문자}Dto(entity);
    }

    /**
     * {도메인명_한글} 단일 조회
     * @param id {도메인명_한글} 식별자
     */
    async findById(id: number): Promise<{도메인명_첫글자_대문자}Dto> {
        const entity = await this.{도메인명}Repository.findById(id);
        return new {도메인명_첫글자_대문자}Dto(entity);
    }

    /**
     * 식별자로 {도메인명_한글} 조회 (Entity 반환)
     * @param id {도메인명_한글} 식별자
     */
    async findEntityById(id: number): Promise<{도메인명_첫글자_대문자}> {
        return await this.{도메인명}Repository.findById(id);
    }

    /**
     * {도메인명_한글} 정보 저장
     * @param entity {도메인명_한글} 엔티티
     */
    async save(entity: {도메인명_첫글자_대문자}): Promise<{도메인명_첫글자_대문자}Dto> {
        const savedEntity = await this.{도메인명}Repository.save(entity);
        return new {도메인명_첫글자_대문자}Dto(savedEntity);
    }

    /**
     * {도메인명_한글} 삭제
     * @param id {도메인명_한글} 식별자
     */
    async deleteById(id: number): Promise<boolean> {
        return await this.{도메인명}Repository.deleteById(id);
    }
}
```

---

### 4. Module (`{도메인명}.module.ts`)

**위치**: `src/{도메인명}/{도메인명}.module.ts`

**규칙**:
- `@Module()` 데코레이터 필수
- controllers: `[{도메인명_첫글자_대문자}Controller]`
- providers: `[{도메인명_첫글자_대문자}Service, {도메인명_첫글자_대문자}Repository]`
- exports: `[{도메인명_첫글자_대문자}Service]` (다른 모듈에서 사용할 경우)

**템플릿**:
```typescript
import { Module } from '@nestjs/common';
import { {도메인명_첫글자_대문자}Service } from './{도메인명}.service';
import { {도메인명_첫글자_대문자}Controller } from './{도메인명}.controller';
import { {도메인명_첫글자_대문자}Repository } from './repository/{도메인명}.repository';

@Module({
    controllers: [{도메인명_첫글자_대문자}Controller],
    providers: [
        {도메인명_첫글자_대문자}Service,
        {도메인명_첫글자_대문자}Repository,
    ],
    exports: [{도메인명_첫글자_대문자}Service],
})
export class {도메인명_첫글자_대문자}Module { }
```

---

### 5. Controller (`{도메인명}.controller.ts`)

**위치**: `src/{도메인명}/{도메인명}.controller.ts`

**규칙**:
- `@Controller('{도메인명}')` 데코레이터 필수
- `@ApiTags('{도메인명_첫글자_대문자}')` 데코레이터 추가
- `@ApiBearerAuth('access-token')` 데코레이터 추가 (JWT 인증 필요시)
- Service를 constructor에서 주입

**템플릿**:
```typescript
import { Controller } from '@nestjs/common';
import { {도메인명_첫글자_대문자}Service } from './{도메인명}.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('{도메인명_첫글자_대문자}')
@Controller('{도메인명}')
@ApiBearerAuth('access-token')
export class {도메인명_첫글자_대문자}Controller {
    constructor(private readonly {도메인명}Service: {도메인명_첫글자_대문자}Service) { }

    // 여기에 API 엔드포인트 추가
}
```

---

### 6. Create DTO (`{도메인명}-create.dto.ts`)

**위치**: `src/{도메인명}/dto/{도메인명}-create.dto.ts`

**규칙**:
- BaseEntity의 필드는 **제외** (id, createdAt, updatedAt, deletedAt 모두 제외)
- 도메인별 필드만 포함
- `@ApiProperty()` 데코레이터로 Swagger 문서화
- `class-validator` 데코레이터로 검증:
  - `@IsNotEmpty()`: 필수 필드
  - `@IsOptional()`: 선택 필드
  - `@IsString()`, `@IsNumber()` 등 타입 검증

**템플릿**:
```typescript
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class {도메인명_첫글자_대문자}CreateDto {
    @ApiProperty({ description: '필드 설명' })
    @IsNotEmpty()
    @IsString()
    fieldName: string;

    // 여기에 도메인별 필드 추가
}
```

---

### 7. DTO (`{도메인명}.dto.ts`)

**위치**: `src/{도메인명}/dto/{도메인명}.dto.ts`

**규칙**:
- BaseEntity의 필드를 포함하되, **`deletedAt`은 제외**
- 포함할 BaseEntity 필드:
  - `id: number`
  - `createdAt: Date`
  - `updatedAt: Date`
- `@ApiProperty()` 데코레이터로 Swagger 문서화
- Entity를 받는 constructor 필요

**BaseEntity 구조**:
```typescript
export class BaseEntity {
    id: number;           // ✅ DTO에 포함
    createdAt: Date;      // ✅ DTO에 포함
    updatedAt: Date;      // ✅ DTO에 포함
    deletedAt: Date;      // ❌ DTO에 제외
}
```

**템플릿**:
```typescript
import { ApiProperty } from "@nestjs/swagger";
import { {도메인명_첫글자_대문자} } from "../entity/{도메인명}.entity";

export class {도메인명_첫글자_대문자}Dto {
    @ApiProperty({ description: '{도메인명_한글} 식별자' })
    id: number;

    @ApiProperty({ description: '생성일시' })
    createdAt: Date;

    @ApiProperty({ description: '수정일시' })
    updatedAt: Date;

    // 여기에 도메인별 필드 추가

    constructor(entity: {도메인명_첫글자_대문자}) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
        // 도메인별 필드 매핑
    }
}
```

---

## 예시: `product` 도메인 생성

도메인명이 `product`인 경우:

### 1. Entity (`src/product/entity/product.entity.ts`)
```typescript
import { BaseEntity } from "src/common/base-entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Product extends BaseEntity {
    @Column({ type: 'varchar', length: 255, comment: '상품명' })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, comment: '가격' })
    price: number;
}
```

### 2. Repository (`src/product/repository/product.repository.ts`)
```typescript
import { Injectable } from "@nestjs/common";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { Product } from "../entity/product.entity";
import { ProductCreateDto } from "../dto/product-create.dto";
import { ServiceException } from "src/common/filter/exception/service.exception";
import { MESSAGE_CODE } from "src/common/filter/config/message-code.config";

@Injectable()
export class ProductRepository extends Repository<Product> {
    constructor(private dataSource: DataSource) {
        super(Product, dataSource.createEntityManager());
    }

    async createProduct(createDto: ProductCreateDto): Promise<Product> {
        const product = this.create(createDto);
        await this.save(product);
        return product;
    }

    async findById(id: number): Promise<Product> {
        const product = await this.findOne({
            where: {
                id,
            },
        });
        if (!product) {
            throw new ServiceException(MESSAGE_CODE.PRODUCT_NOT_FOUND);
        }
        return product;
    }

    async deleteById(id: number): Promise<boolean> {
        const rtn: DeleteResult = await this.softDelete({
            id,
        });
        return rtn.affected > 0;
    }
}
```

### 3. Create DTO (`src/product/dto/product-create.dto.ts`)
```typescript
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ProductCreateDto {
    @ApiProperty({ description: '상품명' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '가격' })
    @IsNotEmpty()
    @IsString()
    price: string;
}
```

### 4. DTO (`src/product/dto/product.dto.ts`)
```typescript
import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entity/product.entity";

export class ProductDto {
    @ApiProperty({ description: '상품 식별자' })
    id: number;

    @ApiProperty({ description: '생성일시' })
    createdAt: Date;

    @ApiProperty({ description: '수정일시' })
    updatedAt: Date;

    @ApiProperty({ description: '상품명' })
    name: string;

    @ApiProperty({ description: '가격' })
    price: number;

    constructor(product: Product) {
        this.id = product.id;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
        this.name = product.name;
        this.price = product.price;
    }
}
```

### 5. Service (`src/product/product.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { Product } from './entity/product.entity';
import { ProductDto } from './dto/product.dto';
import { ProductCreateDto } from './dto/product-create.dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
    ) { }

    async create(createDto: ProductCreateDto): Promise<ProductDto> {
        const product = await this.productRepository.createProduct(createDto);
        return new ProductDto(product);
    }

    async findById(id: number): Promise<ProductDto> {
        const product = await this.productRepository.findById(id);
        return new ProductDto(product);
    }

    async findEntityById(id: number): Promise<Product> {
        return await this.productRepository.findById(id);
    }

    async save(product: Product): Promise<ProductDto> {
        const savedProduct = await this.productRepository.save(product);
        return new ProductDto(savedProduct);
    }

    async deleteById(id: number): Promise<boolean> {
        return await this.productRepository.deleteById(id);
    }
}
```

### 6. Module (`src/product/product.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './repository/product.repository';

@Module({
    controllers: [ProductController],
    providers: [
        ProductService,
        ProductRepository,
    ],
    exports: [ProductService],
})
export class ProductModule { }
```

### 7. Controller (`src/product/product.controller.ts`)
```typescript
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
@ApiBearerAuth('access-token')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    // API 엔드포인트 추가
}
```

### 8. AppModule에 등록 (`src/app.module.ts`)
```typescript
import { ProductModule } from './product/product.module';

@Module({
    imports: [
        // ... 기존 imports
        ProductModule,
    ],
})
export class AppModule { }
```

---

## 중요 사항

1. **BaseEntity 필수**: 모든 Entity는 반드시 `BaseEntity`를 extends 해야 함
2. **DTO에서 deletedAt 제외**: DTO는 BaseEntity의 `id`, `createdAt`, `updatedAt`만 포함하고 `deletedAt`은 제외
3. **네이밍 규칙**:
   - 파일명: 소문자, 케밥케이스 또는 단일 단어 (예: `product.service.ts`)
   - 클래스명: 파스칼케이스, 첫글자 대문자 (예: `ProductService`)
   - 변수명: 카멜케이스 (예: `productService`)
4. **의존성 주입**: Repository는 `DataSource`를 주입받아야 함
5. **에러 처리**: Repository의 `findById`에서 Entity를 찾지 못하면 `ServiceException` 발생
6. **소프트 삭제**: `deleteById`는 `softDelete`를 사용하여 논리 삭제 수행
7. **메시지 코드 규칙**: 도메인별로 100번 단위로 메시지 코드를 할당
   - User: 1000-1099
   - Auth: 1100-1199
   - Store: 1200-1299
   - 새로운 도메인: 1300-1399, 1400-1499... 순서대로 할당
   - `MESSAGE_CODE`와 `MESSAGE_TEXT`에 동시에 추가 필요

---

## 체크리스트

새 도메인 생성 시 다음을 확인하세요:

- [ ] Entity가 `BaseEntity`를 extends 하는가?
- [ ] Repository가 `Repository<Entity>`를 extends 하는가?
- [ ] Repository에 `@Injectable()` 데코레이터가 있는가?
- [ ] Service에 `@Injectable()` 데코레이터가 있는가?
- [ ] Module에 Controller, Service, Repository가 모두 providers에 등록되어 있는가?
- [ ] Create DTO가 생성되었는가?
- [ ] Create DTO에 BaseEntity 필드(id, createdAt, updatedAt, deletedAt)가 없는가?
- [ ] Repository의 create 메서드가 CreateDto를 인자로 받는가?
- [ ] Service의 create 메서드가 CreateDto를 인자로 받는가?
- [ ] DTO에 `deletedAt`이 없는가?
- [ ] DTO에 `id`, `createdAt`, `updatedAt`이 포함되어 있는가?
- [ ] AppModule에 새 Module이 imports에 추가되었는가?

