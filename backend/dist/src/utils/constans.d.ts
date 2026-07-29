export declare const POSTGRES_ERROR_CODES: {
    readonly UNIQUE_VIOLATION: "23505";
};
export type PostgresErrorCode = (typeof POSTGRES_ERROR_CODES)[keyof typeof POSTGRES_ERROR_CODES];
