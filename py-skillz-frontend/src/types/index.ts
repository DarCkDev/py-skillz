// Definición de roles de usuario
export type UserRole = 'admin' | 'teacher' | 'student' | 'guest';

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



