import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { InterestType } from '@prisma/client';

export class CreateSimulationDto {
  @IsNumber()
  downPayment!: number;

  @IsNumber()
  installments!: number;

  @IsNumber()
  interestRate!: number;

  @IsOptional()
  @IsNumber()
  cet?: number;

  @IsEnum(InterestType)
  @IsOptional()
  interestType?: InterestType;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  vehicleId!: string;
}