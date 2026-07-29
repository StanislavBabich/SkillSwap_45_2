export type ErrorResponse = {
    statusCode: number;
    message: string;
};
export type ErrorResponseDev = ErrorResponse & {
    timestamp: string;
    path: string;
    method: string;
};
