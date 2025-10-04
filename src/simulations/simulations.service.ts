import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSimulationDto, InterestType } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SimulationsService {
  constructor(private prisma: PrismaService) {}

  private calculateSimpleInterest(amount: number, rate: number, installments: number): number {
    return amount * (rate / 100) * installments;
  }

  private calculateCompoundInterest(amount: number, rate: number, installments: number): number {
    return amount * Math.pow(1 + rate / 100, installments) - amount;
  }

  private calculateFinancing(
    downPayment: number,
    installments: number,
    interestRate: number,
    vehiclePrice: number,
    interestType: InterestType,
  ) {
    const financedAmount = vehiclePrice - downPayment;

    let totalInterest = 0;

    if (interestType === InterestType.SIMPLE) {
      totalInterest = this.calculateSimpleInterest(financedAmount, interestRate, installments);
    } else {
      totalInterest = this.calculateCompoundInterest(financedAmount, interestRate, installments);
    }

    const totalPaid = downPayment + financedAmount + totalInterest;
    const result = totalPaid;

    const details = {
      financedAmount,
      totalInterest,
      totalInstallments: installments,
      averageInstallment: (financedAmount + totalInterest) / installments,
      interestType,
    };

    return { result, financedAmount, totalPaid, details };
  }

  async create(data: CreateSimulationDto, userId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: data.vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const interestType = data.interestType ?? InterestType.COMPOUND;

    const { result, financedAmount, totalPaid, details } = this.calculateFinancing(
      data.downPayment,
      data.installments,
      data.interestRate,
      vehicle.price,
      interestType,
    );

    const simulationData: Prisma.SimulationUncheckedCreateInput = {
      downPayment: data.downPayment,
      installments: data.installments,
      interestRate: data.interestRate,
      result,
      financedAmount,
      totalPaid,
      interestType: interestType as any,
      cet: data.cet,
      details,
      userId: userId,
      vehicleId: data.vehicleId,
    };

    return this.prisma.simulation.create({ data: simulationData });
  }

  async findAll() {
    return this.prisma.simulation.findMany();
  }

  async findOne(id: string) {
    const simulation = await this.prisma.simulation.findUnique({ where: { id } });
    if (!simulation) throw new NotFoundException('Simulation not found');
    return simulation;
  }

  async update(id: string, data: UpdateSimulationDto) {
    const currentSimulation = await this.findOne(id);
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: currentSimulation.vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const interestType = data.interestType ?? currentSimulation.interestType;

    const downPayment = data.downPayment ?? currentSimulation.downPayment;
    const installments = data.installments ?? currentSimulation.installments;
    const interestRate = data.interestRate ?? currentSimulation.interestRate;

    if ('userId' in data) delete (data as any).userId;
    if ('vehicleId' in data) delete (data as any).vehicleId;

    const { result, financedAmount, totalPaid, details } = this.calculateFinancing(
      downPayment,
      installments,
      interestRate,
      vehicle.price,
      interestType as InterestType,
    );

    const updateData: Prisma.SimulationUncheckedUpdateInput = {
      ...data,
      result,
      financedAmount,
      totalPaid,
      details,
      interestType: interestType as any,
    };

    return this.prisma.simulation.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.simulation.delete({ where: { id } });
  }
}