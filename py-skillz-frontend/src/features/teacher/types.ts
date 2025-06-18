export interface RespuestaOpcionMultiple {
  texto: string;
  correcta: boolean;
}

export interface EjercicioBase {
  id: string; 
  pregunta?: string;
  orden?: number; 
}

export interface EjercicioLink extends EjercicioBase {
  tipo: 'link';
  url: string;
}

export interface EjercicioCodigo extends EjercicioBase {
  tipo: 'codigo';
  descripcion?: string; 
  codigoBase: string;
  resultadoEsperado: string;
  feedbackSugerido?: string;
}

export interface EjercicioOpcionMultiple extends EjercicioBase {
  tipo: 'opcion_multiple';
  respuestas: RespuestaOpcionMultiple[];
}

export interface EjercicioQuiz extends EjercicioBase {
  tipo: 'quiz';
  respuestasString: string; 
}

export type Ejercicio = EjercicioLink | EjercicioCodigo | EjercicioOpcionMultiple | EjercicioQuiz;

export interface Subtitulo {
  id: string;
  tituloSubtitulo: string;
  titulo?: string;
  textoEnriquecido: string;
  videoFile?: File;
  videoUrl?: string; 
  documentoFile?: File;
  documentoUrl?: string; 
  ejercicios: Ejercicio[];
  orden: number;
}

export interface Examen {
  ejerciciosExa: Ejercicio[];
}

export interface Tema {
  id: string;
  tituloTema: string;
  subtitulos: Subtitulo[];
  examen?: Examen; 
  orden: number;
}

export interface CursoData {
  tituloCurso: string;
  idiomaCurso: 'español' | 'quechua' | 'aymara' | 'guaraní' | '';
  nivel: 'básico' | 'intermedio' | 'avanzado' | '';
  licenciaCurso: 'CC-BY' | 'CC-BY-SA' | '';
  descripcion: string;
  imagenDestacadaFile?: File;
  imagenDestacada?: string; 
  temas: Tema[];
} 