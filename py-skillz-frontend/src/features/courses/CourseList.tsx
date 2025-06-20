import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '../../components/ui/use-toast';
import { getCourses, deleteCourse } from './api/api';
import { Course } from './types';
import { CourseCard } from '../../components/course/CourseCard';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CourseListProps {
  isAdmin: boolean;
}

export const CourseList: React.FC<CourseListProps> = ({ isAdmin }) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      console.log('Fetched courses:', data); // Debugging line
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Error al cargar los cursos.');
      toast('Error al cargar los cursos. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = (courseId: number) => {
    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete);
        toast('Curso eliminado correctamente.');
        fetchCourses(); // Refetch courses after deletion
      } catch (err) {
        console.error('Error deleting course:', err);
        toast('No se pudo eliminar el curso. Inténtalo de nuevo.');
      } finally {
        setIsDeleteDialogOpen(false);
        setCourseToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const createCourseLink = isAdmin ? '/admin/courses/create' : '/courses/create';

  if (loading) {
    return <div className="text-center py-8">Cargando cursos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
        <Link to={createCourseLink}>
          <Button className="bg-primary">
            <PlusCircle className="mr-2 h-5 w-5" /> Crear Nuevo Curso
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay cursos disponibles. ¡Crea uno nuevo!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={handleDeleteCourse}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
