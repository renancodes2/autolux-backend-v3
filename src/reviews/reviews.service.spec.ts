import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;

  const mockReview = {
    id: 'review1',
    content: 'Great car!',
    rating: 5,
    userId: 'user1',
    vehicleId: 'vehicle1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: {
            review: {
              create: jest.fn().mockResolvedValue(mockReview),
              findMany: jest.fn().mockResolvedValue([mockReview]),
              findUnique: jest.fn().mockResolvedValue(mockReview),
              update: jest.fn().mockResolvedValue(mockReview),
              delete: jest.fn().mockResolvedValue(mockReview),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a review', async () => {
    const dto = {
      content: 'Great car!',
      rating: 5,
      vehicleId: 'vehicle1',
    };

    const result = await service.create(dto as any, 'user1');

    expect(prisma.review.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        ...dto,
        userId: 'user1',
      }),
    }));
    expect(result).toEqual(mockReview);
  });

  it('should find all reviews', async () => {
    const result = await service.findAll();

    expect(prisma.review.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockReview]);
  });

  it('should find one review by id', async () => {
    const result = await service.findOne('review1');

    expect(prisma.review.findUnique).toHaveBeenCalledWith({ where: { id: 'review1' } });
    expect(result).toEqual(mockReview);
  });

  it('should throw NotFoundException if review not found', async () => {
    jest.spyOn(prisma.review, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a review', async () => {
    const updateDto = {
      content: 'Updated review content',
      rating: 4,
    };

    const result = await service.update('review1', updateDto);

    expect(prisma.review.update).toHaveBeenCalledWith({
      where: { id: 'review1' },
      data: updateDto,
    });
    expect(result).toEqual(mockReview);
  });

  it('should throw NotFoundException when updating non-existing review', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

    await expect(service.update('invalid-id', {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should remove a review', async () => {
    const result = await service.remove('review1');

    expect(prisma.review.delete).toHaveBeenCalledWith({ where: { id: 'review1' } });
    expect(result).toEqual(mockReview);
  });

  it('should throw NotFoundException when removing non-existing review', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

    await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
