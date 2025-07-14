import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
