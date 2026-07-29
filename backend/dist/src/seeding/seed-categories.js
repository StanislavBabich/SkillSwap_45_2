"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = seedCategories;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../categories/entities/category.entity");
const seed_categories_data_1 = require("./data/seed-categories.data");
async function seedCategories(dataSource) {
    const repository = dataSource.getRepository(category_entity_1.Category);
    for (const data of seed_categories_data_1.CategoriesData) {
        let parent = await repository.findOneBy({
            name: data.name,
            parent: (0, typeorm_1.IsNull)(),
        });
        if (!parent) {
            parent = await repository.save(repository.create({ name: data.name, parent: null }));
        }
        for (const childName of data.children ?? []) {
            const child = await repository.findOneBy({
                name: childName,
                parent: { id: parent.id },
            });
            if (!child) {
                await repository.save(repository.create({ name: childName, parent }));
            }
        }
    }
    const total = seed_categories_data_1.CategoriesData.reduce((count, category) => count + 1 + (category.children?.length ?? 0), 0);
    console.log(`Категории: обработано ${total}`);
}
//# sourceMappingURL=seed-categories.js.map