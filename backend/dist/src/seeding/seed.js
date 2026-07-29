"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const seed_admin_1 = require("./seed-admin");
const seed_categories_1 = require("./seed-categories");
const seed_skills_1 = require("./seed-skills");
const seed_users_1 = require("./seed-users");
async function run() {
    await data_source_1.SeedingDataSource.initialize();
    try {
        await (0, seed_users_1.seedUsers)(data_source_1.SeedingDataSource);
        await (0, seed_categories_1.seedCategories)(data_source_1.SeedingDataSource);
        await (0, seed_skills_1.seedSkills)(data_source_1.SeedingDataSource);
        await (0, seed_admin_1.seedAdmin)(data_source_1.SeedingDataSource);
        console.log('Все сиды успешно выполнены');
    }
    finally {
        await data_source_1.SeedingDataSource.destroy();
    }
}
run().catch((error) => {
    console.error('Ошибка выполнения сидов', error);
    process.exitCode = 1;
});
//# sourceMappingURL=seed.js.map