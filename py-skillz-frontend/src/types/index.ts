// Definición de roles de usuario
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | '';

// Interfaz de usuario
export interface User {
  id: string;
  info: InfoUser;
  isAuthenticated: boolean,
  role: UserRole;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface InfoUser{
  name: string;
  email: string;
}

// Preferencias de usuario
export interface UserPreferences {
  language: 'es' | 'qu' | 'ay' | 'gn';
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    lineHeight: 'small' | 'medium' | 'large';
  };
  notifications: boolean;
}

// Interfaz inicio de sesión
export interface ILogin {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type Error400Response = {
  statusCode: number;
  message: string[];
  error: string;
};

export interface EditCreateUser extends Partial<UserInfo>{
  password?: string;
}

export interface CreateStudent {
  fullName: string;
  email: string;
  password: string;
}

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
