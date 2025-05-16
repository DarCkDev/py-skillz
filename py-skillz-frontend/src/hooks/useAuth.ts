export const useAuth = () => {
  // Aquí la lógica real de autenticación
  //en role ponen que quieren ver teacher, student, admin
  return {
    isAuthenticated: false,
    role: '', 
    loading: false,
    user: {
      name: 'Usuario Ejemplo',
      email: 'usuario@ejemplo.com'
    }
  };
};