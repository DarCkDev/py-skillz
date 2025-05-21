import { User } from "../types/index";
export const useAuth = ():User => {
  // Aquí la lógica real de autenticación
  //en role ponen que quieren ver teacher, student, admin
  return {
    id:'1',
    isAuthenticated: false,
    role: '', 
    info: {
      name: 'Usuario Ejemplo',
      email: 'usuario@ejemplo.com'
    }
  };
};