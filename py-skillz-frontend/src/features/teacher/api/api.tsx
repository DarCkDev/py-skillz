import { CursoData } from '../types';

const API_URL = 'http://localhost:3003'; // Cambia si tu backend está en otra URL

export const crearCurso = async (payload: CursoData) => {
  //const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en el localStorage
  const token = sessionStorage.getItem('token'); // O usa sessionStorage si prefieres
  const response = await fetch(`${API_URL}/curso`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Si usas autenticación, agrega el token aquí
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Error al crear el curso');
  return await response.json();
};