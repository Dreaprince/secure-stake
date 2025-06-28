import { Test, TestingModule } from '@nestjs/testing';
import { VerifyMeService } from './verify-me-service.service';

describe('VerifyMeServiceService', () => {
  let service: VerifyMeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyMeService],
    }).compile();

    service = module.get<VerifyMeService>(VerifyMeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
