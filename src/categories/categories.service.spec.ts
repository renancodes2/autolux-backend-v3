import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockCategory = {
    id: 'category1',
    name: 'SUV',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: {
            category: {
              create: jest.fn().mockResolvedValue(mockCategory),
              findMany: jest.fn().mockResolvedValue([mockCategory]),
              findUnique: jest.fn().mockResolvedValue(mockCategory),
              update: jest.fn().mockResolvedValue(mockCategory),
              delete: jest.fn().mockResolvedValue(mockCategory),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a category', async () => {
    const dto = { name: 'SUV' };
    const result = await service.create(dto);

    expect(prisma.category.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(mockCategory);
  });

  it('should find all categories', async () => {
    const result = await service.findAll();

    expect(prisma.category.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockCategory]);
  });

  it('should find one category by id', async () => {
    const result = await service.findOne('category1');

    expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { id: 'category1' } });
    expect(result).toEqual(mockCategory);
  });

  it('should throw NotFoundException if category not found', async () => {
    jest.spyOn(prisma.category, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a category', async () => {
    const updateDto = { name: 'Sedan' };
    const result = await service.update('category1', updateDto);

    expect(prisma.category.update).toHaveBeenCalledWith({ where: { id: 'category1' }, data: updateDto });
    expect(result).toEqual(mockCategory);
  });

  it('should throw NotFoundException when updating non-existing category', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

    await expect(service.update('invalid-id', { name: 'Fake' })).rejects.toThrow(NotFoundException);
  });

  it('should remove a category', async () => {
    const result = await service.remove('category1');

    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 'category1' } });
    expect(result).toEqual(mockCategory);
  });

  it('should throw NotFoundException when removing non-existing category', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

    await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
