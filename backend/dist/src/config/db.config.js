"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const config_1 = require("@nestjs/config");
exports.dbConfig = (0, config_1.registerAs)('DB_CONFIG', () => {
    const isTestEnv = process.env.NODE_ENV === 'test';
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'postgres',
        password: String(process.env.DB_PASSWORD || 'postgres'),
        database: isTestEnv
            ? process.env.DB_NAME_TEST || 'skillswap_test'
            : process.env.DB_NAME || 'skillswap_db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: false,
    };
});
//# sourceMappingURL=db.config.js.map