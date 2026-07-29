export declare const appConfig: (() => {
    port: number;
    hashSalt: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    hashSalt: number;
}>;
export type TAppConfig = ReturnType<typeof appConfig>;
