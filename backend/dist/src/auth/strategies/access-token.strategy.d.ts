import { Strategy } from 'passport-jwt';
import { TJwtConfig } from '../../config/jwt.config';
import type { TJwtPayload, TJwtUser } from '../auth.types';
declare const AccessTokenStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    private readonly config;
    constructor(config: TJwtConfig);
    validate(payload: TJwtPayload): TJwtUser;
}
export {};
