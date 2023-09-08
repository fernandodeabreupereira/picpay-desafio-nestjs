import { SetMetadata } from '@nestjs/common';

export const ROUTE_IS_PUBLIC_KEY = 'isPublic';
export const RouteIsPublic = () => SetMetadata(ROUTE_IS_PUBLIC_KEY, true);