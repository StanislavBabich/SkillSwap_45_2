import { Test, TestingModule } from '@nestjs/testing';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

describe('RequestsController', () => {
  let controller: RequestsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: {
            create: jest.fn(),
            getIncoming: jest.fn(),
            getOutgoing: jest.fn(),
            markAsRead: jest.fn(),
            accept: jest.fn(),
            reject: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<RequestsController>(RequestsController);
  });
  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });
});
