import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course } from '../../features/courses/types';
import { Edit, Trash2, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onDelete: (courseId: number) => void;
  isAdmin: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete, isAdmin }) => {
  const { t } = useTranslation();
  const courseLinkPrefix = isAdmin ? '/admin/courses' : '/courses';

  return (
    <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="relative h-48 mb-4 rounded-t-lg overflow-hidden">
          <img
            src={course.imagenDestacada || '/placeholder-course.jpg'}
            alt={course.titulo}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-primary">
            {course.nivel}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold line-clamp-2">{course.titulo}</CardTitle>
        <CardDescription className="line-clamp-2">{course.descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {course.temas?.length || 0} {t('myCourses.topics')}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.idioma}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Link to={`${courseLinkPrefix}/${course.id}`} className="w-full">
          <Button className="w-full bg-primary">
            {t('myCourses.viewCourse')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        {isAdmin && (
          <div className="flex justify-end space-x-2 w-full">
            <Link to={`${courseLinkPrefix}/edit/${course.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <Edit className="h-4 w-4 mr-1" /> {t('common.edit')}
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={() => onDelete(course.id)} className="w-full">
              <Trash2 className="h-4 w-4 mr-1" /> {t('common.delete')}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
