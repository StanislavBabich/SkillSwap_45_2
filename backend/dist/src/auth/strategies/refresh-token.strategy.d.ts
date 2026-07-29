import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { TJwtConfig } from '../../config/jwt.config';
import type { RefreshTokenPayload } from '../auth.types';
declare const RefreshTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    private readonly config;
    constructor(config: TJwtConfig);
    validate(req: Request, payload: RefreshTokenPayload): {
        id: string;
        refreshToken: string;
    };
}
export {};
