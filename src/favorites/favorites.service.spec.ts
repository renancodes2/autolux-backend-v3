import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { NotFoundException } from '@nestjs/common';

const mockFavorite = {
  id: 'fav123',
  userId: 'user456',
  vehicleId: 'car789',
};

const mockPrisma = {
  favorite: {
    create: jest.fn().mockResolvedValue(mockFavorite),
    findMany: jest.fn().mockResolvedValue([mockFavorite]),
    findUnique: jest.fn().mockImplementation(({ where: { id } }) =>
      id === mockFavorite.id ? Promise.resolve(mockFavorite) : Promise.resolve(null),
    ),
    update: jest.fn().mockResolvedValue(mockFavorite),
    delete: jest.fn().mockResolvedValue(mockFavorite),
  },
};

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: 'PrismaService', useValue: mockPrisma },
        { provide: 'PrismaService', useValue: mockPrisma },
        { provide: 'PrismaService', useValue: mockPrisma },
      ],
    })
      .overrideProvider(FavoritesService)
      .useValue(new FavoritesService(mockPrisma as any))
      .compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should create a favorite', async () => {
    const dto = { vehicleId: 'carro123' } as unknown as any;
    const userId = 'usuario456';

    const result = await service.create(dto, userId);

    expect(mockPrisma.favorite.create).toHaveBeenCalledWith({
      data: { ...dto, userId },
    });
    expect(result).toEqual(mockFavorite);
  });

  it('should return all favorites', async () => {
    const result = await service.findAll();

    expect(mockPrisma.favorite.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockFavorite]);
  });

  it('should return a favorite by id', async () => {
    const result = await service.findOne(mockFavorite.id);

    expect(mockPrisma.favorite.findUnique).toHaveBeenCalledWith({
      where: { id: mockFavorite.id },
    });
    expect(result).toEqual(mockFavorite);
  });

  it('should throw NotFoundException if favorite not found', async () => {
    await expect(service.findOne('wrong-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a favorite', async () => {
    const updateDto = { vehicleId: 'carro999' };
    jest.spyOn(service, 'findOne').mockResolvedValue(mockFavorite as any);

    const result = await service.update(mockFavorite.id, updateDto);

    expect(service.findOne).toHaveBeenCalledWith(mockFavorite.id);
    expect(mockPrisma.favorite.update).toHaveBeenCalledWith({
      where: { id: mockFavorite.id },
      data: updateDto,
    });
    expect(result).toEqual(mockFavorite);
  });

  it('should remove a favorite', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockFavorite as any);

    const result = await service.remove(mockFavorite.id);

    expect(service.findOne).toHaveBeenCalledWith(mockFavorite.id);
    expect(mockPrisma.favorite.delete).toHaveBeenCalledWith({
      where: { id: mockFavorite.id },
    });
    expect(result).toEqual(mockFavorite);
  });
});
