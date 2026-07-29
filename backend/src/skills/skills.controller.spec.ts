import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

describe('SkillsController', () => {
  let controller: SkillsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findSimilarUsers: jest.fn(),
            addToFavorites: jest.fn(),
            removeFromFavorites: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<SkillsController>(SkillsController);
  });
  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });
});
