import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API metadata', () => {
      const result = appController.getApiInfo();

      // Assert the structure of your response
      expect(result).toHaveProperty('name', 'Teacher Admin System APIs');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('links');
    });
  });
});
