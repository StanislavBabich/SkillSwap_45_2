"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSkills = seedSkills;
const category_entity_1 = require("../categories/entities/category.entity");
const skill_entity_1 = require("../skills/entities/skill.entity");
const user_entity_1 = require("../users/entities/user.entity");
const seed_skills_data_1 = require("./data/seed-skills.data");
async function seedSkills(dataSource) {
    const skillRepository = dataSource.getRepository(skill_entity_1.Skill);
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const categoryRepository = dataSource.getRepository(category_entity_1.Category);
    for (const data of seed_skills_data_1.SkillsData) {
        const owner = await userRepository.findOneByOrFail({
            email: data.ownerEmail,
        });
        const category = await categoryRepository.findOneByOrFail({
            name: data.categoryName,
        });
        const existing = await skillRepository.findOneBy({
            title: data.title,
            owner: { id: owner.id },
        });
        await skillRepository.save(skillRepository.create({
            ...existing,
            title: data.title,
            description: data.description,
            owner,
            category,
        }));
    }
    console.log(`Навыки: обработано ${seed_skills_data_1.SkillsData.length}`);
}
//# sourceMappingURL=seed-skills.js.map