import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
    }).compile();
    controller = module.get<FilesController>(FilesController);
  });

  describe('uploadFile', () => {
    it('должен возвращать URL загруженного файла', () => {
      const mockFile = {
        filename: '123-uuid.png',
        originalname: 'test.png',
        mimetype: 'image/png',
      } as Express.Multer.File;
      expect(controller.uploadFile(mockFile)).toEqual({
        url: '/uploads/123-uuid.png',
      });
    });

    it('должен выбрасывать BadRequestException, если файл не передан', () => {
      expect(() =>
        controller.uploadFile(undefined as unknown as Express.Multer.File),
      ).toThrow(BadRequestException);
    });
  });
});
