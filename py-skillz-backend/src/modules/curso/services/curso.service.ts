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
    createCursoDto.temas.forEach((temaDto) => {
      temaDto.subtitulos.forEach((subtituloDto) => {
        console.log(subtituloDto);
      });
    });
    const curso = this.cursoRepository.create({
      titulo: createCursoDto.tituloCurso,
      idioma: createCursoDto.idiomaCurso,
      nivel: createCursoDto.nivel,
      licencia: createCursoDto.licenciaCurso,
      descripcion: createCursoDto.descripcion,
<<<<<<< HEAD
      imagenDestacada: createCursoDto.imagenDestacada,
=======
      imagenDestacada: createCursoDto.imagenDestacada, // Add this line
>>>>>>> dev
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
          videoUrl: subtituloDto.videoUrl,
          documentoUrl: subtituloDto.documentoUrl,
          orden: subtituloDto.orden,
          tema: tema,
        });
        await this.subtituloRepository.save(subtitulo);

        for (const ejercicioDto of subtituloDto.ejercicios) {
          const ejercicio = this.ejercicioRepository.create({
            tipo:
              ejercicioDto.tipo === 'opcionMultiple'
                ? EjercicioTipo.OPCION_MULTIPLE
                : ejercicioDto.tipo === 'codigo'
                  ? EjercicioTipo.CODIGO
                  : ejercicioDto.tipo === 'link'
                    ? EjercicioTipo.LINK
                    : ejercicioDto.tipo === 'quiz'
                      ? EjercicioTipo.QUIZ
                      : EjercicioTipo.OPCION_MULTIPLE, // valor por defecto
            subtitulo: subtitulo,
            contenido: {
              pregunta: ejercicioDto.pregunta,
              ...(ejercicioDto.tipo === 'quiz'
                ? { respuestas: ejercicioDto.respuestasString }
                : ejercicioDto.tipo === 'opcionMultiple'
                  ? { respuestas: ejercicioDto.respuestas }
                  : ejercicioDto.tipo === 'codigo'
                    ? {
                        codigoBase: ejercicioDto.codigoBase,
                        resultadoEsperado: ejercicioDto.resultadoEsperado,
                        feedbackSugerido: ejercicioDto.feedbackSugerido,
                      }
                    : ejercicioDto.tipo === 'link'
                      ? { url: ejercicioDto.url }
                      : {}),
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
            tipo:
              ejercicioExaDto.tipo === 'opcionMultiple'
                ? EjercicioTipo.OPCION_MULTIPLE
                : ejercicioExaDto.tipo === 'codigo'
                  ? EjercicioTipo.CODIGO
                  : ejercicioExaDto.tipo === 'link'
                    ? EjercicioTipo.LINK
                    : ejercicioExaDto.tipo === 'quiz'
                      ? EjercicioTipo.QUIZ
                      : EjercicioTipo.OPCION_MULTIPLE, // valor por defecto
            examen: examen,
            contenido: {
              pregunta: ejercicioExaDto.pregunta,
              ...(ejercicioExaDto.tipo === 'quiz'
                ? { respuestas: ejercicioExaDto.respuestasString }
                : ejercicioExaDto.tipo === 'opcionMultiple'
                  ? { respuestas: ejercicioExaDto.respuestas }
                  : ejercicioExaDto.tipo === 'codigo'
                    ? {
                        codigoBase: ejercicioExaDto.codigoBase,
                        resultadoEsperado: ejercicioExaDto.resultadoEsperado,
                        feedbackSugerido: ejercicioExaDto.feedbackSugerido,
                      }
                    : ejercicioExaDto.tipo === 'link'
                      ? { url: ejercicioExaDto.url }
                      : {}),
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
<<<<<<< HEAD
=======

  async findByUser(userPayload: PayloadDto): Promise<Curso[]> {
    return this.cursoRepository.find({
      where: { creador: { id: userPayload.sub } },
      relations: ['temas'],
    });
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoRepository.find({
      relations: ['temas', 'creador'],
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
      creator: { id: userPayload.sub },
      tag: createTaskDto.tag,
      objectives: createTaskDto.objectives,
      deadline: createTaskDto.deadline,
      fileUrl: createTaskDto.fileUrl,
    });

    // Guardar la tarea
    const savedTask = await this.taskRepository.save(task);

    // Retornar la tarea con sus relaciones y el tag
    return this.taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['course', 'creator'],
      select: [
        'id',
        'title',
        'description',
        'instructions',
        'tag',
        'objectives',
        'deadline',
        'fileUrl',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async getTasksByCourse(courseId: number) {
    return await this.taskRepository.find({
      where: { course: { id: courseId } },
      relations: ['creator'],
      select: [
        'id',
        'title',
        'description',
        'instructions',
        'tag',
        'objectives',
        'deadline',
        'fileUrl',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.cursoRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Curso con ID ${id} no encontrado`);
    }
  }

  async findOne(id: number) {
    try {
      const curso = await this.cursoRepository.findOne({
        where: { id },
        relations: [
          'temas',
          'temas.subtitulos',
          'temas.subtitulos.ejercicios',
          'temas.examenes',
          'temas.examenes.ejercicios',
          'creador',
        ],
      });

      if (!curso) {
        throw new Error('Curso no encontrado');
      }

      return curso;
    } catch (error) {
      console.error('Error al buscar el curso:', error);
      throw new Error('Error al obtener el curso');
    }
  }
>>>>>>> dev
}
