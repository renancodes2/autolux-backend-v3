import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto, buyerId: string) {
    const orderData: Prisma.OrderUncheckedCreateInput = {
      status: data.status as any,
      vehicleId: data.vehicleId,
      buyerId: buyerId,
    };

    return this.prisma.order.create({
      data: orderData,
    });
  }

  async findAll() {
    return this.prisma.order.findMany();
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, data: UpdateOrderDto) {
    await this.findOne(id);

    const updateData: Prisma.OrderUncheckedUpdateInput = {
      ...(data as any),
    };

    if ('buyerId' in updateData) {
      delete (updateData as any).buyerId;
    }

    return this.prisma.order.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}