import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReviewDto, userId: string) {
    return this.prisma.review.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany();
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, data: UpdateReviewDto) {
    await this.findOne(id);
    return this.prisma.review.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.review.delete({ where: { id } });
  }
}
