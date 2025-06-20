import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FileUpload from '../../components/shared/fileUpload';
import { PlusCircle} from 'lucide-react';
import type { Subtitulo, Ejercicio } from './types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Importar Accordion

// Props para SubtituloComponent
interface SubtituloComponentProps {
  temaId: string;
  subtitulo: Subtitulo;
  actualizarSubtitulo: <K extends keyof Omit<Subtitulo, 'videoFile' | 'documentoFile'>>(
    temaId: string,
    subtituloId: string,
    campo: K,
    valor: Subtitulo[K]
  ) => void;
  handleSubtituloFileChange: (
    temaId: string,
    subtituloId: string,
    tipo: 'video' | 'documento',
    files: File[]
  ) => void;
  abrirModalEjercicio: (tipo: 'subtitulo' | 'examen', temaId: string, subtituloId?: string, ejercicio?: Ejercicio) => void;
  eliminarEjercicioSubtitulo: (temaId: string, subtituloId: string, ejercicioId: string) => void;
}

const SubtituloComponent: React.FC<SubtituloComponentProps> = ({
  temaId,
  subtitulo,
  actualizarSubtitulo,
  handleSubtituloFileChange,
  abrirModalEjercicio,
  eliminarEjercicioSubtitulo,
}) => {
  return (
    <div className="p-3 border rounded-md bg-card shadow-sm text-card-foreground">
      
      <Textarea
        placeholder="Texto enriquecido (WYSIWYG pendiente)"
        value={subtitulo.textoEnriquecido}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          actualizarSubtitulo(temaId, subtitulo.id, 'textoEnriquecido', e.target.value)
        }
        className="mb-3 text-sm bg-background border-border text-foreground"
        rows={3}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1 font-medium">Video (opcional)</label>
          <FileUpload
            maxFiles={1}
            accept=".mp4,.mov,.avi,.wmv"
            onFilesChange={(files) => handleSubtituloFileChange(temaId, subtitulo.id, 'video', files)}
          />
          {subtitulo.videoFile && (
            <p className='text-xs mt-1 text-muted-foreground'>Video cargado: {subtitulo.videoFile.name}</p>
          )}
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1 font-medium">Documento (opcional)</label>
          <FileUpload
            maxFiles={1}
            accept=".pdf,.pptx,.docx,.xlsx"
            onFilesChange={(files) => handleSubtituloFileChange(temaId, subtitulo.id, 'documento', files)}
          />
          {subtitulo.documentoFile && (
            <p className='text-xs mt-1 text-muted-foreground'>Documento cargado: {subtitulo.documentoFile.name}</p>
          )}
        </div>
        
      </div>

      {/* Ejercicios del Subtítulo */}
      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={`ejercicios-subtitulo-${subtitulo.id}`}>
            <AccordionTrigger className="text-sm font-semibold hover:bg-muted/50">
              Ejercicios del Subtítulo ({subtitulo.ejercicios.length}/2)
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-0">
              {subtitulo.ejercicios.length === 0 && (
                  <p className="text-xs text-muted-foreground mb-2 px-4 py-2">Este subtítulo aún no tiene ejercicios.</p>
              )}
              <div className="space-y-2 mb-2">
                  {subtitulo.ejercicios.map((ejercicio: Ejercicio, index: number) => (
                    <div key={ejercicio.id} className="flex items-center justify-between p-2 border rounded-md bg-background text-xs text-foreground mx-1">
                      <span className="truncate">{index + 1}. {ejercicio.pregunta || `Ejercicio sin pregunta`} - <span className="italic text-muted-foreground">({ejercicio.tipo})</span></span>
                      <div>
                        <Button variant="ghost" size="sm" className="mr-1 text-xs text-primary hover:text-primary/80" onClick={() => abrirModalEjercicio('subtitulo', temaId, subtitulo.id, ejercicio)}>Editar</Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 text-xs" onClick={() => eliminarEjercicioSubtitulo(temaId, subtitulo.id, ejercicio.id)}>Eliminar</Button>
                      </div>
                    </div>
                  ))}
              </div>
              {subtitulo.ejercicios.length < 2 && (
                  <Button
                      type="button"
                      onClick={() => abrirModalEjercicio('subtitulo', temaId, subtitulo.id)}
                      variant="outline"
                      size="sm"
                      className="text-xs mt-1 mb-2 ml-1 text-foreground"
                  >
                      <PlusCircle className="mr-1 h-3 w-3 text-primary" /> Agregar Ejercicio
                  </Button>
              )}
               {subtitulo.ejercicios.length >= 2 && (
                  <p className="text-xs text-destructive mt-1 px-4 py-2">Máximo de 2 ejercicios alcanzado para este subtítulo.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SubtituloComponent; 