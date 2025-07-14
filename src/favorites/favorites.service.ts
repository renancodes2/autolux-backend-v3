import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFavoriteDto, userId: string) {
    return this.prisma.favorite.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.favorite.findMany();
  }

  async findOne(id: string) {
    const favorite = await this.prisma.favorite.findUnique({ where: { id } });
    if (!favorite) throw new NotFoundException('Favorite not found');
    return favorite;
  }

  async update(id: string, data: UpdateFavoriteDto) {
    await this.findOne(id);
    return this.prisma.favorite.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.favorite.delete({ where: { id } });
  }
}
