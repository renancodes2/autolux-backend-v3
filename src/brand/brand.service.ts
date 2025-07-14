import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBrandDto) {
    return this.prisma.brand.create({ data });
  }

  async findAll() {
    return this.prisma.brand.findMany();
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, data: UpdateBrandDto) {
    await this.findOne(id);
    return this.prisma.brand.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.brand.delete({ where: { id } });
  }
}
