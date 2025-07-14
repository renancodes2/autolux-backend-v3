import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSimulationDto {
  @IsNumber()
  entrada!: number;

  @IsNumber()
  parcelas!: number;

  @IsNumber()
  taxa!: number;

  @IsNumber()
  resultado!: number;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  vehicleId!: string;
}
