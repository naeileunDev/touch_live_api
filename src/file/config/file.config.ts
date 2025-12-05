import * as fs from 'fs';
import type { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { join } from 'path';

function getDirectories(source: string): string[] {
    // 디렉토리가 존재하지 않으면 빈 배열 반환
    if (!fs.existsSync(source)) {
        return [];
    }
    
    try {
        return fs
            .readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    } catch (error) {
        // 에러 발생 시 빈 배열 반환
        return [];
    }
}

export function createStaticOptions(): ServeStaticModuleOptions[] {
    // 프로젝트 루트 기준으로 경로 설정 (빌드 전후 모두 대응)
    // __dirname은 빌드 후 dist/file/config가 되므로
    // dist/file/config -> dist -> 프로젝트 루트 -> uploads
    const staticRoot = join(__dirname, '../../uploads');

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(staticRoot)) {
        fs.mkdirSync(staticRoot, { recursive: true });
    }

    const categories = getDirectories(staticRoot);
    
    // 카테고리가 없으면 빈 배열 반환
    if (categories.length === 0) {
        return [];
    }
    
    const options: ServeStaticModuleOptions[] = categories.map((category) => ({
        serveRoot: `/${category}`,
        rootPath: join(staticRoot, category),
        renderPath: '*',
    }));

    return options;
}