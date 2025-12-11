import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { StoreOwnerGuard } from '../guard/store-owner.guard';

export function StoreOwner() {
    return applyDecorators(
        SetMetadata('requireStore', true),
        UseGuards(JwtAuthGuard, StoreOwnerGuard),
        ApiBearerAuth('accessToken'),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function NonStoreOwner() {
    return applyDecorators(
        SetMetadata('requireNoStore', true),
        UseGuards(JwtAuthGuard, StoreOwnerGuard),
        ApiBearerAuth('accessToken'),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}