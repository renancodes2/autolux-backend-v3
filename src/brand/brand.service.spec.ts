import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BrandService', () => {
  let service: BrandService;
  let prisma: PrismaService;

  const mockBrand = {
    id: 'brand1',
    name: 'Toyota',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: PrismaService,
          useValue: {
            brand: {
              create: jest.fn().mockResolvedValue(mockBrand),
              findMany: jest.fn().mockResolvedValue([mockBrand]),
              findUnique: jest.fn().mockResolvedValue(mockBrand),
              update: jest.fn().mockResolvedValue(mockBrand),
              delete: jest.fn().mockResolvedValue(mockBrand),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a brand', async () => {
    const dto = { name: 'Toyota' };
    const result = await service.create(dto);

    expect(prisma.brand.create).toHaveBeenCalledWith({ data: dto });
    expect(result).toEqual(mockBrand);
  });

  it('should find all brands', async () => {
    const result = await service.findAll();

    expect(prisma.brand.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockBrand]);
  });

  it('should find one brand by id', async () => {
    const result = await service.findOne('brand1');

    expect(prisma.brand.findUnique).toHaveBeenCalledWith({ where: { id: 'brand1' } });
    expect(result).toEqual(mockBrand);
  });

  it('should throw NotFoundException if brand not found', async () => {
    jest.spyOn(prisma.brand, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a brand', async () => {
    const updateDto = { name: 'Honda' };
    const result = await service.update('brand1', updateDto);

    expect(prisma.brand.update).toHaveBeenCalledWith({ where: { id: 'brand1' }, data: updateDto });
    expect(result).toEqual(mockBrand);
  });

  it('should throw NotFoundException when updating non-existing brand', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

    await expect(service.update('invalid-id', { name: 'Fake' })).rejects.toThrow(NotFoundException);
  });

  it('should remove a brand', async () => {
    const result = await service.remove('brand1');

    expect(prisma.brand.delete).toHaveBeenCalledWith({ where: { id: 'brand1' } });
    expect(result).toEqual(mockBrand);
  });

  it('should throw NotFoundException when removing non-existing brand', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

    await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
