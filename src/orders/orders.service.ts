import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto, buyerId: string) {
    return this.prisma.order.create({
      data: {
        ...data,
        buyerId,
      },
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

    if ('buyerId' in data) {
      delete data.buyerId;
    }

    return this.prisma.order.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}
