import React, { useState } from 'react';
import { BackButton } from '../../components/shared/BackButton';
import FileUpload from '../../components/shared/fileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface TaskData {
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  instructions: string;
  files?: File[];
}

export function CreateTask() {
  const { toast } = useToast();
  const [taskData, setTaskData] = useState<TaskData>({
    courseId: '',
    moduleId: '',
    title: '',
    description: '',
    instructions: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'courseId' | 'moduleId', value: string) => {
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (files: File[]) => {
    setTaskData(prev => ({ ...prev, files }));
  };

  const handleSubmit = async () => {
    try {
      // Aquí irá la lógica para enviar los datos al backend
      console.log(taskData);
      toast({
        title: 'Tarea creada',
        description: 'La tarea se ha creado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al crear la tarea',
        variant: 'destructive',
      });
    }
  };

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
                    <SelectItem value="curso1">Curso de Python Básico</SelectItem>
                    <SelectItem value="curso2">Curso de Python Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Módulo</label>
                <Select onValueChange={(value) => handleSelectChange('moduleId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modulo1">Introducción a Python</SelectItem>
                    <SelectItem value="modulo2">Variables y Tipos de Datos</SelectItem>
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
                <label className="block text-sm font-medium mb-2">Archivos Adjuntos</label>
                <FileUpload
                  onFileChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.py,.txt"
                  multiple
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