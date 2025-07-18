import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

const mockVehicle = {
  id: '1',
  model: 'Model X',
  year: 2023,
  price: 100000,
  available: true,
  sellerId: 'user1',
  categoryId: 'cat1',
  brandId: 'brand1',
  imageUrls: ['http://image.url/car1.jpg'],
  category: {
    id: 'cat1',
    name: 'SUV',
  },
  brand: {
    id: 'brand1',
    name: 'Tesla',
  },
  seller: {
    id: 'user1',
    name: 'John Doe',
    state: null,
    city: null,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    email: 'john@example.com',
    password: 'hashedpassword',
    role: 'USER',
    phone: null,
    profilePic: null,
  },
};

describe('VehiclesService', () => {
  let service: VehiclesService;
  let prisma: PrismaService;
  let cloudinary: typeof Cloudinary;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: PrismaService,
          useValue: {
            vehicle: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
            },
            category: {
              findUnique: jest.fn(),
            },
            brand: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: 'CLOUDINARY',
          useValue: {
            uploader: {
              upload: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    prisma = module.get<PrismaService>(PrismaService);
    cloudinary = module.get('CLOUDINARY');
  });

  describe('uploadImagesToCloudinary', () => {
    it('should throw BadRequestException if no files provided', async () => {
      await expect(service.uploadImagesToCloudinary([])).rejects.toThrow(BadRequestException);
    });

    it('should upload files and return urls', async () => {
      const files = [
        {
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test'),
        },
      ] as Express.Multer.File[];

      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
        secure_url: 'http://image.url/car1.jpg',
      });

      const urls = await service.uploadImagesToCloudinary(files);
      expect(urls).toEqual(['http://image.url/car1.jpg']);
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw BadRequestException if no images', async () => {
      await expect(service.create({} as any, 'user1', [])).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if seller not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({ categoryId: 'cat1', brandId: 'brand1', model: 'X', year: 2023, price: 100000 } as any, 'user1', [{}] as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if category not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockVehicle.seller);
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({ categoryId: 'cat1', brandId: 'brand1', model: 'X', year: 2023, price: 100000 } as any, 'user1', [{}] as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if brand not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockVehicle.seller);
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockVehicle.category);
      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({ categoryId: 'cat1', brandId: 'brand1', model: 'X', year: 2023, price: 100000 } as any, 'user1', [{}] as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create vehicle and return it', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockVehicle.seller);
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockVehicle.category);
      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(mockVehicle.brand);
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({ secure_url: 'http://image.url/car1.jpg' });
      (prisma.vehicle.create as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await service.create(
        {
          model: 'Model X',
          year: 2023,
          price: 100000,
          categoryId: 'cat1',
          brandId: 'brand1',
        } as any,
        'user1',
        [{ mimetype: 'image/jpeg', buffer: Buffer.from('test') } as any],
      );

      expect(result).toEqual(mockVehicle);
      expect(prisma.vehicle.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all vehicles', async () => {
      (prisma.vehicle.findMany as jest.Mock).mockResolvedValue([mockVehicle]);

      const result = await service.findAll();

      expect(result).toEqual([mockVehicle]);
    });
  });

  describe('findOne', () => {
    it('should return vehicle if found', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await service.findOne('1');

      expect(result).toEqual(mockVehicle);
    });

    it('should throw NotFoundException if vehicle not found', async () => {
      (prisma.vehicle.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if category not found', async () => {
      (service.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockVehicle);
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('1', { categoryId: 'cat2' })).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if brand not found', async () => {
      (service.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockVehicle);
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockVehicle.category);
      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('1', { brandId: 'brand2' })).rejects.toThrow(NotFoundException);
    });

    it('should update vehicle and return it', async () => {
      (service.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockVehicle);
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(mockVehicle.category);
      (prisma.brand.findUnique as jest.Mock).mockResolvedValue(mockVehicle.brand);
      (prisma.vehicle.update as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await service.update('1', { model: 'Model Y', categoryId: 'cat1', brandId: 'brand1' });

      expect(result).toEqual(mockVehicle);
    });
  });

  describe('remove', () => {
    it('should remove vehicle and return it', async () => {
      (service.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockVehicle);
      (prisma.vehicle.delete as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await service.remove('1');

      expect(result).toEqual(mockVehicle);
    });
  });
});
