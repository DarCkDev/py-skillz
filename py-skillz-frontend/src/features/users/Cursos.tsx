// src/pages/Cursos.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Cursos() {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3003/curso/public')
      .then(res => setCursos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cursos disponibles</h1>
      {cursos.map((curso: any) => (
        <div key={curso.id} className="border p-4 mb-4 rounded shadow">
          <h2 className="text-xl font-semibold">{curso.titulo}</h2>
          <p>{curso.descripcion}</p>
          {curso.temas.map((tema: any) => (
            <div key={tema.id} className="ml-4 mt-2">
              <h3 className="font-medium">{tema.titulo}</h3>
              {tema.subtitulos.map((sub: any) => (
                <div key={sub.id} className="ml-4 text-sm">
                  - {sub.titulo}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
