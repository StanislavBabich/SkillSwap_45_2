"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const seed_admin_1 = require("./seed-admin");
const seed_categories_1 = require("./seed-categories");
const seed_skills_1 = require("./seed-skills");
const seed_users_1 = require("./seed-users");
const seeds = {
    users: seed_users_1.seedUsers,
    categories: seed_categories_1.seedCategories,
    skills: seed_skills_1.seedSkills,
    admin: seed_admin_1.seedAdmin,
};
async function run() {
    const seedName = process.argv[2];
    const seed = seeds[seedName];
    if (!seed) {
        throw new Error(`Неизвестный сид: ${process.argv[2] ?? ''}`);
    }
    await data_source_1.SeedingDataSource.initialize();
    try {
        await seed(data_source_1.SeedingDataSource);
    }
    finally {
        await data_source_1.SeedingDataSource.destroy();
    }
}
run().catch((error) => {
    console.error('Ошибка выполнения сида', error);
    process.exitCode = 1;
});
//# sourceMappingURL=run-seed.js.map