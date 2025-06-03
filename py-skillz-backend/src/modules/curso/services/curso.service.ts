import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from '../dto/create-curso.dto';
import { Curso } from '../entities/curso.entity';
import { Tema } from '../entities/tema.entity';
import { Subtitulo } from '../entities/subtitulo.entity';
import { Ejercicio } from '../entities/ejercicio.entity';
import { Examen } from '../entities/examen.entity';
import { EjercicioExa } from '../entities/ejercicio-exa.entity';
import { EjercicioTipo } from '../entities/ejercicio-tipo.enum';
import { User } from '../../user/entities/user.entity';
import { PayloadDto } from 'src/modules/auth/dto/payload.dto';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
    @InjectRepository(Tema)
    private readonly temaRepository: Repository<Tema>,
    @InjectRepository(Subtitulo)
    private readonly subtituloRepository: Repository<Subtitulo>,
    @InjectRepository(Ejercicio)
    private readonly ejercicioRepository: Repository<Ejercicio>,
    @InjectRepository(Examen)
    private readonly examenRepository: Repository<Examen>,
    @InjectRepository(EjercicioExa)
    private readonly ejercicioExaRepository: Repository<EjercicioExa>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(
    createCursoDto: CreateCursoDto,
    userPayload: PayloadDto,
  ): Promise<Curso | null> {
    // Buscar el usuario autenticado
    const user = await this.userRepository.findOne({
      where: { id: userPayload.sub },
    });
    if (!user) throw new Error('Usuario no encontrado');
    // Crear el curso
    const curso = this.cursoRepository.create({
      titulo: createCursoDto.tituloCurso,
      idioma: createCursoDto.idiomaCurso,
      nivel: createCursoDto.nivel,
      licencia: createCursoDto.licenciaCurso,
      descripcion: createCursoDto.descripcion,
      creador: user,
    });
    await this.cursoRepository.save(curso);

    for (const temaDto of createCursoDto.temas) {
      const tema = this.temaRepository.create({
        titulo: temaDto.tituloTema,
        orden: temaDto.orden,
        curso: curso,
      });
      await this.temaRepository.save(tema);

      for (const subtituloDto of temaDto.subtitulos) {
        const subtitulo = this.subtituloRepository.create({
          titulo: subtituloDto.tituloSubtitulo,
          contenidoHtml: subtituloDto.textoEnriquecido,
          orden: subtituloDto.orden,
          tema: tema,
        });
        await this.subtituloRepository.save(subtitulo);

        for (const ejercicioDto of subtituloDto.ejercicios) {
          const ejercicio = this.ejercicioRepository.create({
            tipo: ejercicioDto.tipo as EjercicioTipo,
            pregunta: ejercicioDto.pregunta,
            subtitulo: subtitulo,
            contenido: {
              respuestas: ejercicioDto.respuestas,
              orden: ejercicioDto.orden,
            },
          });
          await this.ejercicioRepository.save(ejercicio);
        }
      }

      // Examen del tema
      if (temaDto.examen) {
        const examen = this.examenRepository.create({
          tema: tema,
          tiempoExamen: temaDto.examen.tiempoExamen ?? null,
        });
        await this.examenRepository.save(examen);

        for (const ejercicioExaDto of temaDto.examen.ejerciciosExa) {
          const ejercicioExa = this.ejercicioExaRepository.create({
            tipo: ejercicioExaDto.tipo as EjercicioTipo,
            pregunta: ejercicioExaDto.pregunta,
            examen: examen,
            contenido: {
              respuestas: ejercicioExaDto.respuestas,
              orden: ejercicioExaDto.orden,
            },
          });
          await this.ejercicioExaRepository.save(ejercicioExa);
        }
      }
    }

    // Devuelve el curso con relaciones cargadas
    return this.cursoRepository.findOne({
      where: { id: curso.id },
      relations: [
        'temas',
        'temas.subtitulos',
        'temas.subtitulos.ejercicios',
        'temas.examenes',
        'temas.examenes.ejercicios',
      ],
    });
  }

  async findByUser(userPayload: PayloadDto): Promise<Curso[]> {
    return this.cursoRepository.find({
      where: { creador: { id: userPayload.sub } },
      relations: ['temas']
    });
  }

  async createTask(createTaskDto: CreateTaskDto, userPayload: PayloadDto) {
    // Buscar el curso con sus relaciones
    const curso = await this.cursoRepository.findOne({
      where: { id: parseInt(createTaskDto.courseId.toString()) },
      relations: ['creador'],
    });

    if (!curso) {
      throw new Error('Curso no encontrado');
    }

    // Verificar permisos
    if (curso.creador.id !== userPayload.sub) {
      throw new Error('No tienes permiso para crear tareas en este curso');
    }

    // Crear la tarea con las relaciones correctas
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      instructions: createTaskDto.instructions,
      course: curso,
      creator: { id: userPayload.sub }
    });

    // Guardar la tarea
    const savedTask = await this.taskRepository.save(task);

    // Retornar la tarea con sus relaciones
    return this.taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['course', 'creator']
    });
  }

  async getTasksByCourse(courseId: number) {
    return await this.taskRepository.find({
      where: { course: { id: courseId } },
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });
  }
}
