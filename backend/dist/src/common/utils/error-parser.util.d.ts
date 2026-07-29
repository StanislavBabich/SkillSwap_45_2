interface DuplicateErrorResult {
    status: number;
    message: string;
}
export interface DriverError {
    code?: string;
    detail?: string;
    table?: string;
    constraint?: string;
}
export declare function parseDuplicateError(exception: unknown): DuplicateErrorResult | null;
export {};
