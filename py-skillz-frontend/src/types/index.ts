// Definición de roles de usuario
export type UserRole = 'admin' | 'teacher' | 'student' | 'guest';

// Interfaz de usuario
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  preferences?: UserPreferences;
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

