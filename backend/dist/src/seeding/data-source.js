"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedingDataSource = void 0;
require("dotenv/config");
const typeorm_1 = require("typeorm");
const db_config_1 = require("../config/db.config");
exports.SeedingDataSource = new typeorm_1.DataSource((0, db_config_1.dbConfig)());
//# sourceMappingURL=data-source.js.map