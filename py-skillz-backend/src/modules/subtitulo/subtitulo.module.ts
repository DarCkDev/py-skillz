import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subtitulo } from './entities/subtitulo.entity';
import { SubtituloController } from './controllers/subtitulo.controller';
import { SubtituloService } from './services/subtitulo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subtitulo])],
  controllers: [SubtituloController],
  providers: [SubtituloService],
  exports: [SubtituloService],
})
export class SubtituloModule {}
