import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsService } from './simulations.service';
import { PrismaService } from '../prisma/prisma.service';
import { InterestType } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('SimulationsService', () => {
  let service: SimulationsService;
  let prisma: PrismaService;

  const mockVehicle = {
    id: 'vehicle1',
    price: 50000,
  };

  const mockSimulation = {
    id: 'simulation1',
    downPayment: 1000,
    installments: 12,
    interestRate: 1,
    result: 60000,
    financedAmount: 49000,
    totalPaid: 60000,
    interestType: InterestType.COMPOUND,
    cet: 2,
    details: {
      financedAmount: 49000,
      totalInterest: 10000,
      totalInstallments: 12,
      averageInstallment: 4083.33,
      interestType: InterestType.COMPOUND,
    },
    userId: 'user1',
    vehicleId: 'vehicle1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationsService,
        {
          provide: PrismaService,
          useValue: {
            vehicle: {
              findUnique: jest.fn().mockResolvedValue(mockVehicle),
            },
            simulation: {
              create: jest.fn().mockResolvedValue(mockSimulation),
              findMany: jest.fn().mockResolvedValue([mockSimulation]),
              findUnique: jest.fn().mockResolvedValue(mockSimulation),
              update: jest.fn().mockResolvedValue(mockSimulation),
              delete: jest.fn().mockResolvedValue(mockSimulation),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SimulationsService>(SimulationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a simulation', async () => {
    const dto = {
      vehicleId: 'vehicle1',
      downPayment: 1000,
      installments: 12,
      interestRate: 1,
      cet: 2,
      interestType: InterestType.COMPOUND,
    };

    const result = await service.create(dto as any, 'user1');

    expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({ where: { id: dto.vehicleId } });
    expect(prisma.simulation.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: 'user1',
        vehicleId: dto.vehicleId,
      }),
    }));
    expect(result).toEqual(mockSimulation);
  });

  it('should find all simulations', async () => {
    const result = await service.findAll();

    expect(prisma.simulation.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockSimulation]);
  });

  it('should find one simulation by id', async () => {
    const result = await service.findOne('simulation1');

    expect(prisma.simulation.findUnique).toHaveBeenCalledWith({ where: { id: 'simulation1' } });
    expect(result).toEqual(mockSimulation);
  });

  it('should throw NotFoundException if simulation not found', async () => {
    jest.spyOn(prisma.simulation, 'findUnique').mockResolvedValueOnce(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should update a simulation', async () => {
    const updateDto = {
      downPayment: 1500,
      installments: 10,
      interestRate: 2,
      interestType: InterestType.SIMPLE,
    };

    const result = await service.update('simulation1', updateDto);

    expect(prisma.simulation.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'simulation1' },
      data: expect.objectContaining({
        ...updateDto,
      }),
    }));
    expect(result).toEqual(mockSimulation);
  });

  it('should throw NotFoundException when updating non-existing simulation', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

    await expect(service.update('invalid-id', {} as any)).rejects.toThrow(NotFoundException);
  });

  it('should remove a simulation', async () => {
    const result = await service.remove('simulation1');

    expect(prisma.simulation.delete).toHaveBeenCalledWith({ where: { id: 'simulation1' } });
    expect(result).toEqual(mockSimulation);
  });

  it('should throw NotFoundException when removing non-existing simulation', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());

    await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
