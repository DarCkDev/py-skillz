import { Course } from '../types';
import { CursoData } from '../../teacher/types'; 

const API_URL = 'http://localhost:3003'; 
export const getCourses = async (): Promise<Course[]> => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación disponible');
  }

  
  const endpoint = `${API_URL}/curso/mis-cursos`; 

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener los cursos');
  }
  return await response.json();
};

export const getCourseById = async (courseId: number): Promise<Course> => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación disponible');
  }
  const response = await fetch(`${API_URL}/curso/${courseId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener el curso');
  }
  return await response.json();
};

export const crearCurso = async (payload: CursoData) => {
  const token = sessionStorage.getItem('token');
  const response = await fetch(`${API_URL}/curso`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Error al crear el curso');
  return await response.json();
};

export const updateCourse = async (courseId: number, payload: CursoData) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación disponible');
  }
  const response = await fetch(`${API_URL}/curso/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Error al actualizar el curso');
  return await response.json();
};

export const deleteCourse = async (courseId: number): Promise<void> => {
  const token = sessionStorage.getItem('token');
  const response = await fetch(`${API_URL}/curso/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el curso');
  }
};
