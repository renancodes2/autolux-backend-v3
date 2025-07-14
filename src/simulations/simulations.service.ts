import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';

@Injectable()
export class SimulationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSimulationDto, userId: string) {
    return this.prisma.simulation.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.simulation.findMany();
  }

  async findOne(id: string) {
    const simulation = await this.prisma.simulation.findUnique({
      where: { id },
    });
    if (!simulation) throw new NotFoundException('Simulation not found');
    return simulation;
  }

  async update(id: string, data: UpdateSimulationDto) {
    await this.findOne(id);
    return this.prisma.simulation.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.simulation.delete({ where: { id } });
  }
}
