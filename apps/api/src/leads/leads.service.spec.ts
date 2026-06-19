import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';

describe('LeadsService', () => {
  let service: LeadsService;
  let prismaService: any;
  let activitiesService: jest.Mocked<ActivitiesService>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: PrismaService,
          useValue: {
            lead: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            leadNote: { create: jest.fn() },
            activity: { findMany: jest.fn() },
          },
        },
        {
          provide: ActivitiesService,
          useValue: { track: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    prismaService = module.get(PrismaService);
    activitiesService = module.get(ActivitiesService) as any;
    eventEmitter = module.get(EventEmitter2) as any;
  });

  describe('create', () => {
    it('should create a lead and emit lead.created event', async () => {
      const mockLead = { id: 'lead-1', firstName: 'John', lastName: 'Doe', tenantId: 'tenant-1' };
      prismaService.lead.create.mockResolvedValue(mockLead);

      const dto = { firstName: 'John', lastName: 'Doe', email: 'john@example.com', tags: [] };
      const result = await service.create('tenant-1', 'user-1', dto as any);

      expect(result).toEqual(mockLead);
      expect(activitiesService.track).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'created', entityType: 'Lead', entityId: 'lead-1' }),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith('lead.created', expect.objectContaining({
        tenantId: 'tenant-1',
        leadId: 'lead-1',
      }));
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when lead does not exist', async () => {
      prismaService.lead.findFirst.mockResolvedValue(null);
      await expect(service.findOne('tenant-1', 'non-existent-id'))
        .rejects.toThrow(NotFoundException);
    });

    it('should return lead when found', async () => {
      const mockLead = { id: 'lead-1', tenantId: 'tenant-1', firstName: 'John' };
      prismaService.lead.findFirst.mockResolvedValue(mockLead);

      const result = await service.findOne('tenant-1', 'lead-1');
      expect(result).toEqual(mockLead);
    });
  });

  describe('archive', () => {
    it('should archive a lead', async () => {
      prismaService.lead.findFirst.mockResolvedValue({ id: 'lead-1' });
      prismaService.lead.update.mockResolvedValue({ id: 'lead-1', isArchived: true, status: 'ARCHIVED' });

      const result = await service.archive('tenant-1', 'lead-1');
      expect(result.isArchived).toBe(true);
      expect(result.status).toBe('ARCHIVED');
    });
  });
});
