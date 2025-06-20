import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import type { Tema, Subtitulo, Ejercicio } from './types';
import SubtituloComponent from './SubtituloComponent';

// Props para TemaComponent
interface TemaComponentProps {
  tema: Tema;
  actualizarTituloTema: (temaId: string, nuevoTitulo: string) => void;
  eliminarTema: (temaId: string) => void;
  agregarSubtitulo: (temaId: string) => void;
  actualizarSubtitulo: <K extends keyof Omit<Subtitulo, 'videoFile' | 'documentoFile'>>(
    temaId: string,
    subtituloId: string,
    campo: K,
    valor: Subtitulo[K]
  ) => void;
  eliminarSubtitulo: (temaId: string, subtituloId: string) => void;
  handleSubtituloFileChange: (
    temaId: string,
    subtituloId: string,
    tipo: 'video' | 'documento',
    files: File[]
  ) => void;
  abrirModalEjercicio: (tipo: 'subtitulo' | 'examen', temaId: string, subtituloId?: string, ejercicio?: Ejercicio) => void;
  eliminarEjercicioSubtitulo: (temaId: string, subtituloId: string, ejercicioId: string) => void;
  eliminarEjercicioExamen: (temaId: string, ejercicioId: string) => void;
}

const TemaComponent: React.FC<TemaComponentProps> = ({
  tema,
  actualizarTituloTema,
  eliminarTema,
  agregarSubtitulo,
  actualizarSubtitulo,
  eliminarSubtitulo,
  handleSubtituloFileChange,
  abrirModalEjercicio,
  eliminarEjercicioSubtitulo,
  eliminarEjercicioExamen
}) => {
  return (
    <AccordionItem value={`tema-${tema.id}`} className="border rounded-md p-0 mb-4 bg-card shadow">
      <AccordionTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 rounded-t-md">
        <div className="flex items-center flex-grow">
          <GripVertical className="mr-3 h-5 w-5 text-muted-foreground cursor-grab flex-shrink-0" />
          <Input
            value={tema.tituloTema}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => actualizarTituloTema(tema.id, e.target.value)}
            className="text-lg font-medium flex-grow border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-card-foreground"
            onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
            placeholder="Título del Tema"
          />
        </div>
        <Button
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            eliminarTema(tema.id);
          }}
          variant="ghost"
          size="icon"
          className="ml-2 text-destructive hover:text-destructive/80 flex-shrink-0"
          aria-label="Eliminar tema"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </AccordionTrigger>
      <AccordionContent className="p-4 border-t bg-muted/20">
        <div className="ml-0 space-y-1">
          <h3 className="text-md font-semibold mb-2 text-primary px-1">Subtítulos</h3>
          {tema.subtitulos.length === 0 && <p className='text-sm text-muted-foreground p-2'>No hay subtítulos en este tema.</p>}
          <Accordion type="multiple" className="w-full space-y-1">
            {tema.subtitulos.map((subtitulo: Subtitulo) => (
              <AccordionItem key={subtitulo.id} value={`subtitulo-${subtitulo.id}`} className="border rounded-md bg-card shadow-sm">
                <AccordionTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-t-md text-sm font-medium">
                  <div className="flex items-center flex-grow mr-2">
                    <GripVertical className="mr-2 h-5 w-5 text-muted-foreground cursor-grab flex-shrink-0" />
                    <Input
                      value={subtitulo.tituloSubtitulo}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        actualizarSubtitulo(tema.id, subtitulo.id, 'tituloSubtitulo', e.target.value)
                      }
                      onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                      className="font-semibold w-1/2 flex-grow border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent text-card-foreground"
                      placeholder="Título del Subtítulo"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => eliminarSubtitulo(tema.id, subtitulo.id)}
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AccordionTrigger>
                <AccordionContent className="p-0 border-t">
                  <SubtituloComponent
                    temaId={tema.id}
                    subtitulo={subtitulo}
                    actualizarSubtitulo={actualizarSubtitulo}                    
                    handleSubtituloFileChange={handleSubtituloFileChange}
                    abrirModalEjercicio={abrirModalEjercicio}
                    eliminarEjercicioSubtitulo={eliminarEjercicioSubtitulo}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button
            type="button"
            onClick={() => agregarSubtitulo(tema.id)}
            variant="outline"
            size="sm"
            className="text-foreground mt-3 ml-1"
          >
            <PlusCircle className="mr-2 h-4 w-4 text-primary" /> Agregar Subtítulo
          </Button>
        </div>

        <div className="mt-6 pt-4">
          <h3 className="text-md font-semibold mb-3 text-primary">Examen del Tema</h3>
          {(!tema.examen || tema.examen.ejerciciosExa.length === 0) && (
            <p className="text-sm text-muted-foreground mb-2">Este tema aún no tiene ejercicios en el examen.</p>
          )}
          <div className="space-y-2 mb-3">
            {tema.examen?.ejerciciosExa.map((ejercicio: Ejercicio, index: number) => (
              <div key={ejercicio.id} className="flex items-center justify-between p-2 border rounded-md bg-background text-sm shadow-sm text-foreground">
                <span className="truncate flex-1 mr-2">{index + 1}. {ejercicio.pregunta || `Ejercicio ${ejercicio.tipo}`}</span>
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm" className="mr-1 text-xs text-primary hover:text-primary/80" onClick={() => abrirModalEjercicio('examen', tema.id, undefined, ejercicio)}>Editar</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 text-xs" onClick={() => eliminarEjercicioExamen(tema.id, ejercicio.id)}>Eliminar</Button>
                </div>
                
              </div>
            ))}
          </div>
          {(!tema.examen || tema.examen.ejerciciosExa.length < 8) && (
            <Button
              type="button"
              onClick={() => abrirModalEjercicio('examen', tema.id)}
              variant="outline"
              size="sm"
              className="text-xs text-foreground"
            >
              <PlusCircle className="mr-1 h-3 w-3 text-primary" /> Agregar Ejercicio al Examen ({(tema.examen?.ejerciciosExa.length || 0)}/8)
            </Button>
          )}
          {tema.examen && tema.examen.ejerciciosExa.length >= 8 && (
            <p className="text-xs text-destructive mt-1">Máximo de 8 ejercicios alcanzado para este examen.</p>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TemaComponent; 