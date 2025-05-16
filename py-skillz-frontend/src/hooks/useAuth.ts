// Hook para obtener el rol del usuario
export const useAuth = () => {
  // Aquí implementarías la lógica real de autenticación
  return {
    isAuthenticated: true,
    role: 'teacher', 
    loading: false
  };
};