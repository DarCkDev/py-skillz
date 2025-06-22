import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ejercicio } from './entities/ejercicio.entity';
import { EjercicioController } from './controllers/ejercicio.controller';
import { EjercicioService } from './services/ejercicio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ejercicio])],
  controllers: [EjercicioController],
  providers: [EjercicioService],
  exports: [EjercicioService],
})
export class EjercicioModule {}
