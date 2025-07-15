import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';

@Controller('simulations')
export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: Omit<CreateSimulationDto, 'userId'>, @GetUser() user: any) {
    return this.simulationsService.create(dto as any, user.userId);
  }

  @Get()
  findAll() {
    return this.simulationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulationsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSimulationDto) {
    return this.simulationsService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulationsService.remove(id);
  }
}
