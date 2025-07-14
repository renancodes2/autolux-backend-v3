import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
