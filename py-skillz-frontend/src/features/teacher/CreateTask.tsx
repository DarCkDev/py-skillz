import React, { useState, useEffect } from 'react';
import { BackButton } from '../../components/shared/BackButton';
import FileUpload from '../../components/shared/fileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import { useNavigate } from 'react-router-dom';

interface Course {
  id: number;
  titulo: string;
}

interface TaskData {
  courseId: string;
  title: string;
  description: string;
  instructions: string;
  tag?: string;
  objectives?: string;
  deadline?: string;
  files?: File[];
}

export function CreateTask() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState<TaskData>({
    courseId: '',
    title: '',
    description: '',
    instructions: '',
    tag: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3003/curso/mis-cursos', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al cargar los cursos');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los cursos',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);
    
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'courseId', value: string) => {
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (files: File[]) => {
    setTaskData(prev => ({ ...prev, files }));
  };

  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem('token');
      console.log('Token:', token);
      console.log('Task Data:', taskData);
      
      if (!taskData.tag) {
        toast({
          title: "Error",
          description: "Debes seleccionar una etiqueta de tarea",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch('http://localhost:3003/curso/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...taskData,
          courseId: parseInt(taskData.courseId),
          tag: taskData.tag || undefined,
        }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) throw new Error('Error al crear la tarea');

      toast("Tarea creada correctamente");

      navigate('/my-courses');
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Hubo un error al crear la tarea',
        variant: 'destructive',
      });
    }
  };
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <BackButton />
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p>Cargando cursos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-10">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Tarea</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Curso</label>
                <Select onValueChange={(value) => handleSelectChange('courseId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Título de la Tarea</label>
                <Input
                  name="title"
                  placeholder="Ej: Ejercicio de Variables"
                  value={taskData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <Textarea
                  name="description"
                  placeholder="Describe el objetivo de la tarea..."
                  value={taskData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Instrucciones</label>
                <Textarea
                  name="instructions"
                  placeholder="Escribe las instrucciones detalladas para la tarea..."
                  value={taskData.instructions}
                  onChange={handleInputChange}
                />
              </div>
               <div>
                  <label className="block text-sm font-medium mb-2">Etiqueta de Tarea</label>
                  <Select onValueChange={(value) => setTaskData(prev => ({ ...prev, tag: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una etiqueta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="codificacion">Tareas de Codificación</SelectItem>
                      <SelectItem value="investigacion">Investigación y/o Desarrollo</SelectItem>
                      <SelectItem value="seleccion">Selección Múltiple</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Objetivos Requeridos</label>
                  <Textarea
                    name="objectives"
                    placeholder="Describe qué debe lograr el estudiante..."
                    value={taskData.objectives}
                    onChange={handleInputChange}
                />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Límite de Tiempo</label>
                  <Input
                    name="deadline"
                    type="datetime-local"
                    value={taskData.deadline}
                    onChange={handleInputChange}
                />
                </div>
                <div>
                <label className="block text-sm font-medium mb-2">Archivos Adjuntos</label>
                <FileUpload
                  onFilesChange={handleFilesChange}
                  accept=".pdf,.doc,.docx,.py,.txt"
                  maxFiles={5}
                />
              </div>
            </div>
            <Button onClick={handleSubmit}>Crear Tarea</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 