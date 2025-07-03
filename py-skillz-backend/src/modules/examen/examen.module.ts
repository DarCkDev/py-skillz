import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Examen } from './entities/examen.entity';
import { ExamenController } from './controllers/examen.controller';
import { ExamenService } from './services/examen.service';

@Module({
  imports: [TypeOrmModule.forFeature([Examen])],
  controllers: [ExamenController],
  providers: [ExamenService],
  exports: [ExamenService],
})
export class ExamenModule {}
