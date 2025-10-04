import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum OrderStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

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
