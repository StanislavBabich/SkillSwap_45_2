import { DataSourceOptions } from 'typeorm';
export declare const dbConfig: (() => DataSourceOptions) & import("@nestjs/config").ConfigFactoryKeyHost<DataSourceOptions>;
export type TDbConfig = ReturnType<typeof dbConfig>;
