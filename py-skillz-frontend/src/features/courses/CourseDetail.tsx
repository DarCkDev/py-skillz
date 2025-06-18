import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from '../../components/ui/tabs';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
} from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';

import { getCourseById } from './api/api';
import { Course, Task, Ejercicio } from '@/types/index';

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [course, setCourse]         = useState<Course | null>(null);
  const [tasks,  setTasks]          = useState<Task[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error,   setError]         = useState<string | null>(null);
  const [selectedTemaId, setSelectedTemaId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No hay token de autenticación');

        const data = await getCourseById(Number(id));
        setCourse(data);
        setSelectedTemaId(data.temas[0]?.id ?? null);

        const res = await fetch(`http://localhost:3003/curso/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al obtener las tareas');
        setTasks(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Centered><Spinner /></Centered>;
  if (error || !course)
    return (
      <Centered>
        <p className="text-red-500 mb-4">{error || 'Curso no encontrado'}</p>
        <Button onClick={() => navigate('/my-courses')}>{t('common.back')}</Button>
      </Centered>
    );

  const temaActual = course.temas.find(t => t.id === selectedTemaId) ?? null;

  return (
    <div className="max-w-6xl mx-auto pb-16">
      <header className="relative h-72 sm:h-96 mb-10 rounded-lg overflow-hidden">
        {course.imagenDestacada && (
          <img src={course.imagenDestacada} alt={course.titulo}
               className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-end h-full">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow">
            {course.titulo}
          </h1>
          <div className="mt-4 flex flex-wrap gap-3">
            <Meta label="Idioma"   value={course.idioma} />
            <Meta label="Nivel"    value={course.nivel} />
            <Meta label="Licencia" value={course.licencia} />
            <Meta label="Creador"  value={course.creador.fullName} />
          </div>
        </div>
      </header>

      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-10">
        {course.descripcion}
      </p>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="content">{t('course.content', 'Contenido')}</TabsTrigger>
          <TabsTrigger value="tasks">
            {t('course.tasks', 'Tareas')} {tasks.length > 0 && <Badge>{tasks.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          {course.temas.length === 0 ? (
            <Empty>{t('course.noTopics', 'No hay temas todavía')}</Empty>
          ) : (
            <div className="flex gap-8">
              <aside className="w-56 shrink-0">
                <ul className="space-y-2">
                  {course.temas
                    .slice()
                    .sort((a, b) => a.orden - b.orden)
                    .map((tema) => (
                      <li key={tema.id}>
                        <Button
                          variant={tema.id === selectedTemaId ? 'default' : 'secondary'}
                          className="w-full justify-start"
                          onClick={() => setSelectedTemaId(tema.id)}
                        >
                          {tema.titulo}
                        </Button>
                      </li>
                  ))}
                </ul>
              </aside>

              <main className="flex-1">
                {temaActual ? <TopicPanel tema={temaActual} /> : null}
              </main>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks">
          {tasks.length === 0 ? (
            <Empty>{t('course.noTasks', 'No hay tareas disponibles')}</Empty>
          ) : (
            <ul className="space-y-6">
              {tasks.map((task) => (
                <li key={task.id}
                    className="p-6 rounded-lg border hover:shadow-sm transition-shadow bg-white dark:bg-gray-800">
                  <header className="flex flex-wrap justify-between gap-3 mb-4">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <Badge variant="outline">{tagLabel(task.tag)}</Badge>
                  </header>
                  <p className="mb-3">{task.description}</p>
                  <p className="text-sm text-muted-foreground mb-4">{task.instructions}</p>
                  <footer className="text-xs text-muted-foreground flex justify-between">
                    <span>{t('common.createdBy', 'Creado por')}: {task.creator.fullName}</span>
                    <time dateTime={task.createdAt}>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </time>
                  </footer>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <Button onClick={() => navigate('/my-courses')}>{t('common.back')}</Button>
      </div>
    </div>
  );
}

function TopicPanel({ tema }: { tema: Course['temas'][number] }) {
  return (
    <div>
      <ol className="space-y-6 pl-4 border-l border-muted">
        {tema.subtitulos.map((sub) => (
          <li key={sub.id} className="relative pl-4">
            <span className="absolute -left-2 top-1.5 h-2 w-2 rounded-full bg-primary" />
            <h4 className="text-base font-medium mb-2">{sub.titulo}</h4>

            {sub.contenidoHtml && (
              <div className="prose dark:prose-invert max-w-none mb-4"
                   dangerouslySetInnerHTML={{ __html: sub.contenidoHtml }} />
            )}

            <div className="space-y-3">
              {sub.videoUrl && (
                <video controls src={`http://localhost:3003/${sub.videoUrl}`}
                       className="w-full rounded-md" />
              )}
              {sub.documentoUrl && (
                <iframe src={`http://localhost:3003/${sub.documentoUrl}`}
                        className="w-full h-96 rounded-md border" />
              )}

              {sub.ejercicios.length > 0 && (
                <ExerciseList ejercicios={sub.ejercicios} />
              )}
            </div>
          </li>
        ))}
      </ol>

      {tema.examenes && tema.examenes.length > 0 && (
        <section className="mt-10 border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Examen</h3>
          {tema.examenes.map((examen) => (
            <ExerciseList key={examen.id} ejercicios={examen.ejercicios} />
          ))}
        </section>
      )}
    </div>
  );
}

function ExerciseList({ ejercicios }: { ejercicios: Ejercicio[] }) {
  return (
    <ul className="space-y-2">
      {ejercicios.map((ej) => (
        <li key={ej.id} className="text-sm">
          <ExerciseItem ej={ej} />
        </li>
      ))}
    </ul>
  );
}

function ExerciseItem({ ej }: { ej: Ejercicio }) {
  if (ej.tipo === 'codigo') {
    return (
      <Button size="sm" onClick={() => window.open('http://localhost:3000/editor', '_blank')}>
        {ej.contenido.pregunta}
      </Button>
    );
  }

  if (ej.tipo === 'quiz' || ej.tipo === 'opcion_multiple') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" size="sm" className="p-0">
            {ej.contenido.pregunta}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ej.contenido.pregunta}</DialogTitle>
          </DialogHeader>

          <pre className="mt-4 whitespace-pre-wrap">
            {JSON.stringify(ej.contenido.respuestas, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    );
  }

  if (ej.tipo === 'link') {
    return (
      <a href={ej.contenido.url} target="_blank" rel="noreferrer"
         className="text-blue-600 hover:underline dark:text-blue-400">
        {ej.contenido.pregunta}
      </a>
    );
  }

  return <span>{ej.contenido.pregunta}</span>;
}

const Centered = ({ children }: React.PropsWithChildren) => (
  <div className="flex justify-center items-center h-80">{children}</div>
);

const Empty = ({ children }: React.PropsWithChildren) => (
  <p className="text-center text-muted-foreground py-10">{children}</p>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <span className="text-xs font-medium bg-black/60 text-white rounded px-2 py-1">
    {label}: {value}
  </span>
);

const tagLabel = (tag: string) =>
  ({
    codificacion: 'Codificación',
    investigacion: 'Investigación',
    seleccion: 'Selección múltiple',
    opcion_multiple: 'Selección múltiple',
    otro: 'Otro',
  }[tag] ?? tag);
