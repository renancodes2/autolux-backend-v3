import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { v2 as CloudinaryType } from 'cloudinary';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    @Inject('CLOUDINARY') private cloudinary: typeof CloudinaryType,
  ) {}

  async uploadImagesToCloudinary(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Pelo menos uma imagem é obrigatória.');
    }

    const imageUrls = [];
    for (const file of files) {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await this.cloudinary.uploader.upload(base64, {
        folder: 'autolux/vehicles',
      });
      imageUrls.push(result.secure_url);
    }
    return imageUrls;
  }

  async create(
    data: CreateVehicleDto,
    userId: string,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Pelo menos uma imagem é obrigatória.');
    }

    const seller = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!seller) throw new NotFoundException('Seller not found');

    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    const brand = await this.prisma.brand.findUnique({
      where: { id: data.brandId },
    });
    if (!brand) throw new NotFoundException('Brand not found');

    const imageUrls = await this.uploadImagesToCloudinary(files);

    const { categoryId, brandId, available = true, ...rest } = data;

    return this.prisma.vehicle.create({
      data: {
        ...rest,
        available,
        sellerId: userId,
        categoryId,
        brandId,
        imageUrls,
      },
    });
  }

  async findAll() {
    return this.prisma.vehicle.findMany({
      include: {
        category: true,
        brand: true,
        seller: true,
      },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        seller: true,
      },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async update(id: string, data: UpdateVehicleDto) {
    await this.findOne(id);

    const { categoryId, brandId, ...rest } = data;

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
    }

    if (brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: brandId },
      });
      if (!brand) throw new NotFoundException('Brand not found');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && { categoryId }),
        ...(brandId && { brandId }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.vehicle.delete({ where: { id } });
  }
}