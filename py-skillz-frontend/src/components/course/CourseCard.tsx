import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from '../../features/courses/types';
import { Edit, Trash2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onDelete: (courseId: number) => void;
  isAdmin: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete, isAdmin }) => {
  const courseLinkPrefix = isAdmin ? '/admin/courses' : '/courses';

  return (
    <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <img
        src={course.imagenDestacada || 'https://via.placeholder.com/150'}
        alt={course.titulo}
        className="w-full h-32 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{course.titulo}</h3>
      <p className="text-sm text-gray-600 mb-1">Idioma: {course.idioma}</p>
      <p className="text-sm text-gray-600 mb-1">Nivel: {course.nivel}</p>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.descripcion}</p>
      <div className="flex justify-end space-x-2 mt-auto">
        <Link to={`${courseLinkPrefix}/edit/${course.id}`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={() => onDelete(course.id)}>
          <Trash2 className="h-4 w-4 mr-1" /> Eliminar
        </Button>
      </div>
    </Card>
  );
};
