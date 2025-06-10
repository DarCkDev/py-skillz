import { Subtitulo, Examen } from '../teacher/types';

export interface Course {
  id: number;
  titulo: string;
  idioma: 'español' | 'quechua' | 'aymara' | 'guaraní' | '';
  nivel: 'básico' | 'intermedio' | 'avanzado' | '';
  licencia: 'CC-BY' | 'CC-BY-SA' | '';
  descripcion: string;
  imagenDestacada?: string | null; // URL de la imagen
  temas: Tema[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Tema {
  id: number;
  titulo: string;
  subtitulos: Subtitulo[];
  examen?: Examen;
  orden: number;
}
