import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

export enum InterestType {
  SIMPLE = 'SIMPLE',
  COMPOUND = 'COMPOUND',
}

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
  interestType: InterestType = InterestType.COMPOUND;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty() 
  vehicleId!: string;
}