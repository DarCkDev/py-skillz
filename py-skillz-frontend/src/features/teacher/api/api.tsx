const API_URL = 'http://localhost:3003'; // Cambia si tu backend está en otra URL

export const crearCurso = async (formData: FormData) => {
  //const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en el localStorage
  const token = sessionStorage.getItem('token'); // O usa sessionStorage si prefieres
  const response = await fetch(`${API_URL}/curso`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error('Error al crear el curso');
  return await response.json();
};