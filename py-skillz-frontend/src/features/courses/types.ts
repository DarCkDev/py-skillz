// New interfaces for CourseDetail.tsx
export interface EjercicioLink {
  id: number;
  tipo: 'link';
  contenido: {
    url: string;
    pregunta: string;
  };
}

export interface EjercicioQuiz {
  id: number;
  tipo: 'quiz' | 'opcion_multiple';
  contenido: {
    pregunta: string;
    respuestas: string;
  };
}

export interface EjercicioCodigo {
  id: number;
  tipo: 'codigo';
  contenido: {
    pregunta: string;
    // Add other properties specific to code exercises if any
  };
}

export type Ejercicio = EjercicioLink | EjercicioQuiz | EjercicioCodigo;

export interface Subtitulo {
  id: number;
  titulo: string;
  contenidoHtml?: string;
  videoUrl?: string;
  documentoUrl?: string;
  ejercicios: Ejercicio[];
}

export interface Tema {
  id: number;
  titulo: string;
  orden: number; // Added 'orden' property
  subtitulos: Subtitulo[];
  examenes?: {
    id: number;
    ejercicios: Ejercicio[];
  }[];
}

export interface Course {
  id: number;
  titulo: string;
  descripcion: string;
  imagenDestacada?: string;
  idioma: string;
  nivel: string;
  licencia: string;
  creador: {
    fullName: string;
  };
  temas: Tema[];
  examenes?: {
    id: number;
    ejercicios: Ejercicio[];
  }[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  instructions: string;
  createdAt: string;
  tag: string;
  creator: {
    fullName: string;
  };
}
