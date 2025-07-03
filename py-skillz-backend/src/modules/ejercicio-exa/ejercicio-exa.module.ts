import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EjercicioExa } from './entities/ejercicio-exa.entity';
import { EjercicioExaController } from './controllers/ejercicio-exa.controller';
import { EjercicioExaService } from './services/ejercicio-exa.service';

@Module({
  imports: [TypeOrmModule.forFeature([EjercicioExa])],
  controllers: [EjercicioExaController],
  providers: [EjercicioExaService],
  exports: [EjercicioExaService],
})
export class EjercicioExaModule {}
