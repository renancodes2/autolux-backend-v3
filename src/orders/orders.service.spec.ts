import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            order: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create an order', async () => {
    const dto = {
      buyerId: 'buyer1',
      vehicleId: 'vehicle1',
      status: OrderStatus.PENDING,
    };

    const mockOrder = { id: 'order1', ...dto, createdAt: new Date() };

    (prisma.order.create as jest.Mock).mockResolvedValue(mockOrder);

    const result = await service.create(dto, dto.buyerId);

    expect(prisma.order.create).toHaveBeenCalledWith({
      data: dto,
    });

    expect(result).toEqual(mockOrder);
  });

  it('should find all orders', async () => {
    const mockOrders = [
      { id: 'order1', buyerId: 'buyer1', vehicleId: 'vehicle1', status: OrderStatus.PENDING, createdAt: new Date() },
      { id: 'order2', buyerId: 'buyer2', vehicleId: 'vehicle2', status: OrderStatus.APPROVED, createdAt: new Date() },
    ];

    (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

    const result = await service.findAll();

    expect(prisma.order.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockOrders);
  });

  it('should find one order by id', async () => {
    const mockOrder = { id: 'order1', buyerId: 'buyer1', vehicleId: 'vehicle1', status: OrderStatus.PENDING, createdAt: new Date() };

    (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

    const result = await service.findOne('order1');

    expect(prisma.order.findUnique).toHaveBeenCalledWith({ where: { id: 'order1' } });
    expect(result).toEqual(mockOrder);
  });

  it('should throw NotFoundException when order not found', async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should update an order', async () => {
    const id = 'order1';
    const updateDto = { status: OrderStatus.APPROVED };

    const mockOrder = { id, buyerId: 'buyer1', vehicleId: 'vehicle1', status: OrderStatus.PENDING, createdAt: new Date() };
    const updatedOrder = { ...mockOrder, status: OrderStatus.APPROVED };

    (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
    (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);

    const result = await service.update(id, updateDto);

    expect(prisma.order.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(prisma.order.update).toHaveBeenCalledWith({ where: { id }, data: updateDto });
    expect(result).toEqual(updatedOrder);
  });

  it('should remove an order', async () => {
    const id = 'order1';
    const mockOrder = { id, buyerId: 'buyer1', vehicleId: 'vehicle1', status: OrderStatus.PENDING, createdAt: new Date() };

    (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
    (prisma.order.delete as jest.Mock).mockResolvedValue(mockOrder);

    const result = await service.remove(id);

    expect(prisma.order.findUnique).toHaveBeenCalledWith({ where: { id } });
    expect(prisma.order.delete).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(mockOrder);
  });
});
