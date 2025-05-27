import { CursoData } from '../types';

const API_URL = 'http://localhost:3000'; // Cambia si tu backend está en otra URL

export const crearCurso = async (payload: CursoData) => {
  const response = await fetch(`${API_URL}/curso`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Si usas autenticación, agrega el token aquí
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Error al crear el curso');
  return await response.json();
};