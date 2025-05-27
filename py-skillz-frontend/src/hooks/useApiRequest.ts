
export const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' // URL para desarrollo
  : 'si hay servidor'; // URL para producción
