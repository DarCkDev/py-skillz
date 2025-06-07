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