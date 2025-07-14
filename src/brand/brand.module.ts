import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService, PrismaService],
})
export class BrandModule {}
