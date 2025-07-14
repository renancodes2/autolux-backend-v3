import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsString()
  @IsNotEmpty()
  buyerId!: string;

  @IsString()
  @IsNotEmpty()
  vehicleId!: string;
}
