import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Curso {
  id: number;
  titulo: string;
  idioma: string;
  nivel: string;
  descripcion: string;
  imagenDestacada: string;
  temas: Tema[];
}

interface Tema {
  id: number;
  titulo: string;
  orden: number;
}

export const MyCourses = () => {
  const { t } = useTranslation();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3003/curso/mis-cursos', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al cargar los cursos');
        const data = await response.json();
        setCursos(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('myCourses.title')}</h1>
        <Link to="/courses/create">
          <Button className="bg-primary">
            {t('myCourses.createCourse')}
          </Button>
        </Link>
      </div>

      {cursos.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">{t('myCourses.noCourses')}</h2>
          <p className="text-gray-600 mb-6">{t('myCourses.createFirstCourse')}</p>
          <Link to="/courses/create">
            <Button className="bg-primary">
              {t('myCourses.createCourse')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((curso) => (
            <Card key={curso.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="relative h-48 mb-4 rounded-t-lg overflow-hidden">
                  <img
                    src={curso.imagenDestacada || '/placeholder-course.jpg'}
                    alt={curso.titulo}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary">
                    {curso.nivel}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold line-clamp-2">{curso.titulo}</CardTitle>
                <CardDescription className="line-clamp-2">{curso.descripcion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {curso.temas.length} {t('myCourses.topics')}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {curso.idioma}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/courses/${curso.id}`} className="w-full">
                  <Button className="w-full bg-primary">
                    {t('myCourses.viewCourse')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
