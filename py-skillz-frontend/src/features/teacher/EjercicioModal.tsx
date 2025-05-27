import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, PlusCircle } from 'lucide-react';
import type { Ejercicio, RespuestaOpcionMultiple } from './types';

type EjercicioTipo = Ejercicio['tipo'];

interface EjercicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ejercicio: Ejercicio) => void;
  ejercicioInicial?: Ejercicio | null; 
  tipoContexto: 'subtitulo' | 'examen'; 
}

const EjercicioModal: React.FC<EjercicioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  ejercicioInicial,
  tipoContexto
}) => {
  const [tipoEjercicio, setTipoEjercicio] = useState<EjercicioTipo>('link');
  const [pregunta, setPregunta] = useState('');
  const [url, setUrl] = useState('');
  const [codigoBase, setCodigoBase] = useState('');
  const [resultadoEsperado, setResultadoEsperado] = useState('');
  const [feedbackSugerido, setFeedbackSugerido] = useState('');
  const [opcionesRespuesta, setOpcionesRespuesta] = useState<RespuestaOpcionMultiple[]>([{ texto: '', correcta: false }]);
  const [respuestaQuiz, setRespuestaQuiz] = useState('');

  useEffect(() => {
    if (ejercicioInicial) {
      setTipoEjercicio(ejercicioInicial.tipo);
      setPregunta(ejercicioInicial.pregunta || '');
      switch (ejercicioInicial.tipo) {
        case 'link':
          setUrl(ejercicioInicial.url || '');
          break;
        case 'codigo':
          setCodigoBase(ejercicioInicial.codigoBase || '');
          setResultadoEsperado(ejercicioInicial.resultadoEsperado || '');
          setFeedbackSugerido(ejercicioInicial.feedbackSugerido || '');
          break;
        case 'opcionMultiple':
          setOpcionesRespuesta(ejercicioInicial.respuestas || [{ texto: '', correcta: false }]);
          break;
        case 'quiz':
          setRespuestaQuiz(ejercicioInicial.respuestas || '');
          break;
      }
    } else {
      setTipoEjercicio('link');
      setPregunta('');
      setUrl('');
      setCodigoBase('');
      setResultadoEsperado('');
      setFeedbackSugerido('');
      setOpcionesRespuesta([{ texto: '', correcta: false }]);
      setRespuestaQuiz('');
    }
  }, [ejercicioInicial, isOpen]);

  const handleSave = () => {
    let ejercicioData: Partial<Ejercicio> = {
      id: ejercicioInicial?.id || Date.now().toString(),
      pregunta: pregunta,
      tipo: tipoEjercicio,
    };

    switch (tipoEjercicio) {
      case 'link':
        ejercicioData = { ...ejercicioData, url: url, tipo: 'link' };
        break;
      case 'codigo':
        ejercicioData = { ...ejercicioData, codigoBase, resultadoEsperado, feedbackSugerido, tipo: 'codigo' };
        break;
      case 'opcionMultiple':
        ejercicioData = { ...ejercicioData, respuestas: opcionesRespuesta, tipo: 'opcionMultiple' };
        break;
      case 'quiz':
        ejercicioData = { ...ejercicioData, respuestas: respuestaQuiz, tipo: 'quiz' };
        break;
    }
    onSave(ejercicioData as Ejercicio);
    onClose(); 
  };

  const agregarOpcion = () => {
    setOpcionesRespuesta([...opcionesRespuesta, { texto: '', correcta: false }]);
  };

  const eliminarOpcion = (index: number) => {
    setOpcionesRespuesta(opcionesRespuesta.filter((_, i) => i !== index));
  };

  const actualizarOpcionTexto = (index: number, texto: string) => {
    const nuevasOpciones = [...opcionesRespuesta];
    nuevasOpciones[index].texto = texto;
    setOpcionesRespuesta(nuevasOpciones);
  };

  const actualizarOpcionCorrecta = (index: number, correcta: boolean) => {
    const nuevasOpciones = [...opcionesRespuesta];
    nuevasOpciones[index].correcta = correcta;
    setOpcionesRespuesta(nuevasOpciones);
  };
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{ejercicioInicial ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'} ({tipoContexto})</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <label htmlFor="tipoEjercicio" className="block text-sm font-medium text-muted-foreground mb-1">Tipo de Ejercicio</label>
            <Select value={tipoEjercicio} onValueChange={(value) => setTipoEjercicio(value as EjercicioTipo)}>
              <SelectTrigger id="tipoEjercicio" className="bg-background border-border">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="link">Enlace Externo</SelectItem>
                <SelectItem value="codigo">Código</SelectItem>
                <SelectItem value="opcionMultiple">Opción Múltiple</SelectItem>
                <SelectItem value="quiz">Quiz (Respuesta Corta)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="pregunta" className="block text-sm font-medium text-muted-foreground mb-1">Pregunta / Descripción</label>
            <Textarea id="pregunta" value={pregunta} onChange={(e) => setPregunta(e.target.value)} placeholder="Ej: ¿Qué es una variable en Python?" className="bg-background border-border text-foreground" />
          </div>

          
          {tipoEjercicio === 'link' && (
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-muted-foreground mb-1">URL del Enlace</label>
              <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Ej: https://www.python.org/doc/" className="bg-background border-border text-foreground" />
            </div>
          )}

          {tipoEjercicio === 'codigo' && (
            <>
              <div>
                <label htmlFor="codigoBase" className="block text-sm font-medium text-muted-foreground mb-1">Código Base / Enunciado</label>
                <Textarea id="codigoBase" value={codigoBase} onChange={(e) => setCodigoBase(e.target.value)} rows={4} placeholder="Ej: Escribe una función en Python que devuelva el cuadrado de un número." className="bg-background border-border text-foreground" />
              </div>
              <div>
                <label htmlFor="resultadoEsperado" className="block text-sm font-medium text-muted-foreground mb-1">Resultado Esperado</label>
                <Textarea id="resultadoEsperado" value={resultadoEsperado} onChange={(e) => setResultadoEsperado(e.target.value)} rows={2} placeholder="Ej: cuadrado(5) debería retornar 25" className="bg-background border-border text-foreground" />
              </div>
              <div>
                <label htmlFor="feedbackSugerido" className="block text-sm font-medium text-muted-foreground mb-1">Feedback Sugerido (opcional)</label>
                <Textarea id="feedbackSugerido" value={feedbackSugerido} onChange={(e) => setFeedbackSugerido(e.target.value)} rows={2} placeholder="Ej: Asegúrate de que la función maneje números negativos correctamente." className="bg-background border-border text-foreground"/>
              </div>
            </>
          )}

          {tipoEjercicio === 'opcionMultiple' && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Opciones de Respuesta</label>
              {opcionesRespuesta.map((opcion, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input 
                    value={opcion.texto} 
                    onChange={(e) => actualizarOpcionTexto(index, e.target.value)} 
                    placeholder={`Ej: Un tipo de dato entero ${index + 1}`}
                    className="flex-grow bg-background border-border text-foreground"
                  />
                  <input 
                    type="checkbox" 
                    checked={opcion.correcta} 
                    onChange={(e) => actualizarOpcionCorrecta(index, e.target.checked)} 
                    className="h-5 w-5 rounded border-border text-primary focus:ring-ring"
                    id={`correcta-${index}`}
                  />
                   <label htmlFor={`correcta-${index}`} className="text-sm text-muted-foreground">Correcta</label>
                  {opcionesRespuesta.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => eliminarOpcion(index)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={agregarOpcion} className="mt-1 border-border hover:bg-muted">
                <PlusCircle className="mr-2 h-4 w-4" /> Agregar Opción
              </Button>
            </div>
          )}

          {tipoEjercicio === 'quiz' && (
            <div>
              <label htmlFor="respuestaQuiz" className="block text-sm font-medium text-muted-foreground mb-1">Respuesta Correcta</label>
              <Input id="respuestaQuiz" value={respuestaQuiz} onChange={(e) => setRespuestaQuiz(e.target.value)} placeholder="Ej: print()" className="bg-background border-border text-foreground" />
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-border hover:bg-muted">Cancelar</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">Guardar Ejercicio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EjercicioModal; 