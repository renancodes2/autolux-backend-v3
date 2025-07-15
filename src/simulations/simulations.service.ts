import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { InterestType } from '@prisma/client';

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

    return this.prisma.simulation.create({
      data: {
        downPayment: data.downPayment,
        installments: data.installments,
        interestRate: data.interestRate,
        result,
        financedAmount,
        totalPaid,
        interestType,
        cet: data.cet,
        details,
        userId,
        vehicleId: data.vehicleId,
      },
    });
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

    const { result, financedAmount, totalPaid, details } = this.calculateFinancing(
      downPayment,
      installments,
      interestRate,
      vehicle.price,
      interestType,
    );

    return this.prisma.simulation.update({
      where: { id },
      data: {
        ...data,
        result,
        financedAmount,
        totalPaid,
        details,
        interestType,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.simulation.delete({ where: { id } });
  }
}
