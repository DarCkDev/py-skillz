import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getCourseById } from './api/api';
import { Course } from './types';
import { Badge } from '@/components/ui/badge';

interface Task {
  id: number;
  title: string;
  description: string;
  instructions: string;
  createdAt: string;
  tag: string;
  creator: {
    fullName: string;
  };
}

export function CourseDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseAndTasks = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        // Obtener el curso
        const courseData = await getCourseById(Number(id));
        setCourse(courseData);

        // Obtener las tareas del curso
        const tasksResponse = await fetch(`http://localhost:3003/curso/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!tasksResponse.ok) {
          throw new Error('Error al obtener las tareas');
        }

        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndTasks();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">{error || 'Curso no encontrado'}</p>
            <Button onClick={() => navigate('/my-courses')}>
              {t('common.back')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{course.titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          {course.imagenDestacada && 
          <img src={course.imagenDestacada} alt={course.titulo} className="h-96 w-full object-cover" />
          }
          <p className="text-gray-600 mb-4">{course.descripcion}</p>
          <div>
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-2xl font-bold">Temas del Curso</h2>
              </CardHeader>
              <CardContent>
              {course.temas.map((tema) => {
                return (
                  <Card key={tema.id} className="mb-4">
                    <CardHeader>
                      <h2 className="text-xl font-bold">{tema.titulo}</h2>
                    </CardHeader>
                    <CardContent>
                      <div key={tema.id} className="gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold"></h3>
                          <p className="text-gray-600">{tema.subtitulos.length} Subtitulos</p>
                          {tema.subtitulos.map((subtitulo) => {
                            return (
                              <Card key={subtitulo.id} className="gap-4 mb-4">
                                <CardHeader>
                                  <h2 className="text-xl font-bold">{subtitulo?.titulo}</h2>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-4'>
                                  {subtitulo.documentoUrl && <iframe src={`http://localhost:3003/${subtitulo.documentoUrl}`} height={200} width={400} title="Documento" className="w-full h-96 border-0"></iframe>}
                                  {subtitulo.videoUrl && <video src={`http://localhost:3003/${subtitulo.videoUrl}`} controls className="w-full h-96 border-0"></video>}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}  
            </CardContent>
            </Card>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/my-courses')}>
              {t('common.back')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tareas del Curso</h2>
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex justify-center items-center h-32">
              <p className="text-gray-500">No hay tareas disponibles para este curso</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{task.title}</CardTitle>
                  <Badge variant="secondary">
                    {task.tag === 'codificacion' && 'Tareas de Codificación'}
                    {task.tag === 'investigacion' && 'Investigación y/o Desarrollo'}
                    {task.tag === 'seleccion' && 'Selección Múltiple'}
                    {task.tag === 'otro' && 'Otro'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Descripción</h3>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Instrucciones</h3>
                    <p className="text-gray-600">{task.instructions}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Creado por: {task.creator.fullName}</span>
                    <span>Creado el: {new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 