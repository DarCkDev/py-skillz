import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Tema } from './entities/tema.entity';
import { Subtitulo } from './entities/subtitulo.entity';
import { Ejercicio } from './entities/ejercicio.entity';
import { Examen } from './entities/examen.entity';
import { EjercicioExa } from './entities/ejercicio-exa.entity';
import { CursoController } from './controllers/curso.controller';
import { CursoService } from './services/curso.service';
import { User } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Curso,
      Tema,
      Subtitulo,
      Ejercicio,
      Examen,
      EjercicioExa,
      User,
      Task,
    ]),
  ],
  controllers: [CursoController],
  providers: [CursoService],
  exports: [CursoService],
})
export class CursoModule {}
