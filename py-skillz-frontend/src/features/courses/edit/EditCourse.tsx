import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../../../components/shared/BackButton';
import FileUpload from '../../../components/shared/fileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion } from '@/components/ui/accordion';
import { PlusCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { getCourseById, updateCourse } from '../api/api'; // Updated import path
import { useToast } from '../../../components/ui/use-toast';

import type {
  Ejercicio as EjercicioType,
  Tema as TemaType,
  Subtitulo as SubtituloType,
  CursoData as CursoDataType,
  EjercicioLink as EjercicioLinkType,
  EjercicioCodigo as EjercicioCodigoType,
  EjercicioOpcionMultiple as EjercicioOpcionMultipleType,
  EjercicioQuiz as EjercicioQuizType,
} from '../../teacher/types';

import TemaComponent from '../../teacher/TemaComponent';
import EjercicioModal from '../../teacher/EjercicioModal';
import { Course } from '../types'; // Import Course type from courses/types

type IdiomaCurso = CursoDataType['idiomaCurso'];
type NivelCurso = CursoDataType['nivel'];
type LicenciaCurso = CursoDataType['licenciaCurso'];

interface ModalState {
  isOpen: boolean;
  ejercicio?: EjercicioType | null;
  tipoContexto?: 'subtitulo' | 'examen';
  temaIdContexto?: string;
  subtituloIdContexto?: string;
}

export const EditCourse = () => {
  const { courseId } = useParams<{ courseId: string }>(); // Get courseId from URL
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [cursoData, setCursoData] = useState<CursoDataType>({
    tituloCurso: '',
    idiomaCurso: '',
    nivel: '',
    licenciaCurso: '',
    descripcion: '',
    temas: [],
  });
  const [loadingCourse, setLoadingCourse] = useState(true);

  const [modalState, setModalState] = useState<ModalState>({ isOpen: false });

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        toast.error("ID de curso no proporcionado.");
        setLoadingCourse(false);
        return;
      }
      try {
        const fetchedCourse: Course = await getCourseById(parseInt(courseId));
        setCursoData({
          tituloCurso: fetchedCourse.titulo,
          idiomaCurso: fetchedCourse.idioma,
          nivel: fetchedCourse.nivel,
          licenciaCurso: fetchedCourse.licencia,
          descripcion: fetchedCourse.descripcion,
          imagenDestacada: fetchedCourse.imagenDestacada || undefined,
          temas: fetchedCourse.temas.map(tema => ({
            ...tema,
            id: tema.id.toString(),
            tituloTema: tema.titulo,
            subtitulos: tema.subtitulos.map(sub => ({
              ...sub,
              id: sub.id.toString(),
              tituloSubtitulo: sub.tituloSubtitulo,
              ejercicios: sub.ejercicios.map(ej => ({ ...ej, id: ej.id.toString() })),
            })),
            examen: tema.examen ? {
              ...tema.examen,
              ejerciciosExa: tema.examen.ejerciciosExa.map(ej => ({ ...ej, id: ej.id.toString() })),
            } : { ejerciciosExa: [] },
          })),
        });
      } catch (error) {
        toast.error("Error al cargar el curso.");
        console.error("Error fetching course for edit:", error);
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId, toast]);

  const isPaso1Completo = () => {
    return (
      cursoData.tituloCurso.trim() !== '' &&
      cursoData.idiomaCurso !== '' &&
      cursoData.nivel !== '' &&
      cursoData.licenciaCurso !== '' &&
      cursoData.descripcion.trim() !== ''
    );
  };

  if (loadingCourse) {
    return <div className="text-center py-8">Cargando curso...</div>;
  }

  const siguientePaso = () => {
    if (currentStep === 1 && !isPaso1Completo()) {
      toast.error("Por favor, completa todos los campos requeridos de Información General.");
      return;
    }
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const pasoAnterior = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCursoData((prev: CursoDataType) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    name: 'idiomaCurso' | 'nivel' | 'licenciaCurso',
    value: string
  ) => {
    let typedValue: IdiomaCurso | NivelCurso | LicenciaCurso = '';
    if (name === 'idiomaCurso') typedValue = value as IdiomaCurso;
    else if (name === 'nivel') typedValue = value as NivelCurso;
    else if (name === 'licenciaCurso') typedValue = value as LicenciaCurso;

    setCursoData((prev: CursoDataType) => ({
      ...prev,
      [name]: typedValue,
    }));
  };

  const handleImagenDestacadaChange = (files: File[]) => {
    if (files.length > 0) {
      setCursoData((prev: CursoDataType) => ({ ...prev, imagenDestacadaFile: files[0] }));
    } else {
      setCursoData((prev: CursoDataType) => ({ ...prev, imagenDestacadaFile: undefined }));
    }
  };

  const agregarTema = () => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: [
        ...prev.temas,
        {
          id: Date.now().toString(),
          tituloTema: `Nuevo Tema ${prev.temas.length + 1}`,
          subtitulos: [],
          examen: { ejerciciosExa: [] },
          orden: prev.temas.length + 1,
        } as TemaType,
      ],
    }));
  };

  const eliminarTema = (temaId: string) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.filter((tema: TemaType) => tema.id !== temaId)
        .map((tema: TemaType, index: number) => ({ ...tema, orden: index + 1 })),
    }));
  };

  const actualizarTituloTema = (temaId: string, nuevoTitulo: string) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.map((tema: TemaType) =>
        tema.id === temaId ? { ...tema, tituloTema: nuevoTitulo } : tema
      ),
    }));
  };

  const agregarSubtitulo = (temaId: string) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.map((tema: TemaType) => {
        if (tema.id === temaId) {
          return {
            ...tema,
            subtitulos: [
              ...tema.subtitulos,
              {
                id: Date.now().toString(),
                tituloSubtitulo: `Nuevo Subtítulo ${tema.subtitulos.length + 1}`,
                textoEnriquecido: '',
                ejercicios: [],
                orden: tema.subtitulos.length + 1,
              } as SubtituloType,
            ],
          } as TemaType;
        }
        return tema;
      }),
    }));
  };

  const eliminarSubtitulo = (temaId: string, subtituloId: string) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.map((tema: TemaType) => {
        if (tema.id === temaId) {
          return {
            ...tema,
            subtitulos: tema.subtitulos.filter((sub: SubtituloType) => sub.id !== subtituloId)
              .map((sub: SubtituloType, index: number) => ({ ...sub, orden: index + 1 })),
          } as TemaType;
        }
        return tema;
      }),
    }));
  };

  const actualizarSubtitulo = <K extends keyof Omit<SubtituloType, 'videoFile' | 'documentoFile'>>(
    temaId: string,
    subtituloId: string,
    campo: K,
    valor: SubtituloType[K]
  ) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.map((tema: TemaType) => {
        if (tema.id === temaId) {
          return {
            ...tema,
            subtitulos: tema.subtitulos.map((sub: SubtituloType) =>
              sub.id === subtituloId ? { ...sub, [campo]: valor } : sub
            )
          } as TemaType;
        }
        return tema;
      })
    }));
  };

  const handleSubtituloFileChange = (temaId: string, subtituloId: string, tipo: 'video' | 'documento', files: File[]) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.map((tema: TemaType) => {
        if (tema.id === temaId) {
          return {
            ...tema,
            subtitulos: tema.subtitulos.map((sub: SubtituloType) => {
              if (sub.id === subtituloId) {
                const file = files.length > 0 ? files[0] : undefined;
                if (tipo === 'video') return { ...sub, videoFile: file, videoUrl: undefined };
                if (tipo === 'documento') return { ...sub, documentoFile: file, documentoUrl: undefined };
              }
              return sub;
            })
          } as TemaType;
        }
        return tema;
      })
    }));
  };

  const abrirModalEjercicio = (
    tipoContexto: 'subtitulo' | 'examen',
    temaIdContexto: string,
    subtituloIdContexto?: string,
    ejercicio?: EjercicioType | null
  ) => {
    setModalState({
      isOpen: true,
      ejercicio: ejercicio,
      tipoContexto,
      temaIdContexto,
      subtituloIdContexto,
    });
  };

  const cerrarModalEjercicio = () => {
    setModalState({ isOpen: false });
  };

  const guardarEjercicio = (ejercicioData: EjercicioType) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.map((tema: TemaType) => {
        if (tema.id === modalState.temaIdContexto) {
          if (modalState.tipoContexto === 'subtitulo' && modalState.subtituloIdContexto) {
            return {
              ...tema,
              subtitulos: tema.subtitulos.map((sub: SubtituloType) => {
                if (sub.id === modalState.subtituloIdContexto) {
                  const existe = sub.ejercicios.find((e: EjercicioType) => e.id === ejercicioData.id);
                  let nuevosEjercicios;
                  if (existe) {
                    nuevosEjercicios = sub.ejercicios.map((e: EjercicioType) => e.id === ejercicioData.id ? ejercicioData : e);
                  } else {
                    if (sub.ejercicios.length < 2) {
                      nuevosEjercicios = [...sub.ejercicios, ejercicioData];
                    } else {
                      nuevosEjercicios = sub.ejercicios;
                    }
                  }
                  return { ...sub, ejercicios: nuevosEjercicios.map((e: EjercicioType, i: number) => ({ ...e, orden: i + 1 })) };
                }
                return sub;
              })
            } as TemaType;
          } else if (modalState.tipoContexto === 'examen') {
            const examenActual = tema.examen || { ejerciciosExa: [] };
            const existe = examenActual.ejerciciosExa.find((e: EjercicioType) => e.id === ejercicioData.id);
            let nuevosEjerciciosExamen;
            if (existe) {
              nuevosEjerciciosExamen = examenActual.ejerciciosExa.map((e: EjercicioType) => e.id === ejercicioData.id ? ejercicioData : e);
            } else {
              if (examenActual.ejerciciosExa.length < 8) {
                nuevosEjerciciosExamen = [...examenActual.ejerciciosExa, ejercicioData];
              } else {
                nuevosEjerciciosExamen = examenActual.ejerciciosExa;
              }
            }
            return { ...tema, examen: { ...examenActual, ejerciciosExa: nuevosEjerciciosExamen.map((e: EjercicioType, i: number) => ({ ...e, orden: i + 1 })) } } as TemaType;
          }
        }
        return tema;
      })
    }));
    cerrarModalEjercicio();
  };

  const eliminarEjercicioSubtitulo = (temaId: string, subtituloId: string, ejercicioId: string) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.map((tema: TemaType) => {
        if (tema.id === temaId) {
          return {
            ...tema,
            subtitulos: tema.subtitulos.map((sub: SubtituloType) => {
              if (sub.id === subtituloId) {
                return {
                  ...sub,
                  ejercicios: sub.ejercicios.filter((e: EjercicioType) => e.id !== ejercicioId).map((e: EjercicioType, i: number) => ({ ...e, orden: i + 1 }))
                };
              }
              return sub;
            })
          } as TemaType;
        }
        return tema;
      })
    }));
  };

  const eliminarEjercicioExamen = (temaId: string, ejercicioId: string) => {
    setCursoData((prev: CursoDataType) => ({
      ...prev,
      temas: prev.temas.map((tema: TemaType) => {
        if (tema.id === temaId && tema.examen) {
          return {
            ...tema,
            examen: {
              ...tema.examen,
              ejerciciosExa: tema.examen.ejerciciosExa.filter((e: EjercicioType) => e.id !== ejercicioId).map((e: EjercicioType, i: number) => ({ ...e, orden: i + 1 }))
            }
          } as TemaType;
        }
        return tema;
      })
    }));
  };

  const handleSubmit = async () => {
    if (currentStep === 1 && !isPaso1Completo()) {
      toast.error("Por favor, completa toda la información general del curso antes de guardar.");
      return;
    }
    if (currentStep === 1 && isPaso1Completo()) {
      siguientePaso();
      return;
    }

    // Validation for "min tener 1 curso 1subtitulo con 1 ejercicio y 2 preguntas de examen"
    const hasValidContent = cursoData.temas.some(tema =>
      tema.subtitulos.some(subtitulo =>
        subtitulo.ejercicios.length >= 1 &&
        (tema.examen?.ejerciciosExa?.filter(ej => ej.tipo === 'quiz').length || 0) >= 2
      )
    );

    if (!hasValidContent) {
      toast.error("El curso debe tener al menos 1 tema, 1 subtítulo con 1 ejercicio, y 2 preguntas de examen en el examen del tema.");
      return;
    }

    console.log('CursoData antes de enviar:', JSON.stringify(cursoData, null, 2));

    const uploadFileAndGetUrl = async (file: File | undefined): Promise<string | undefined> => {
      if (!file) return undefined;
      return new Promise(resolve => setTimeout(() => resolve(`https://fakeurl.com/${file.name}`), 100));
    };

    const imagenDestacadaUrl = await uploadFileAndGetUrl(cursoData.imagenDestacadaFile);
    type EjercicioPayloadItem = EjercicioType & { orden: number };




    const temasParaPayload = await Promise.all(
      cursoData.temas.map(async (tema: TemaType) => {
        const subtitulosParaPayload = await Promise.all(
          tema.subtitulos.map(async (sub: SubtituloType) => {
            const videoUrl = await uploadFileAndGetUrl(sub.videoFile) || sub.videoUrl;
            const documentoUrl = await uploadFileAndGetUrl(sub.documentoFile) || sub.documentoUrl;
        
            const ejerciciosProcesados: EjercicioType[] = sub.ejercicios.reduce((acc: EjercicioType[], ej: EjercicioType) => {
              const { pregunta, ...ejercicioSpecificProps } = ej;

        
              switch (ej.tipo) {
                case 'link':
                  acc.push({id:ej.id, tipo: 'link', pregunta, url: (ejercicioSpecificProps as Omit<EjercicioLinkType, 'pregunta' | 'tipo'>).url });
                  break;
                case 'codigo':
                  acc.push({id:ej.id, tipo: 'codigo', pregunta, codigoBase: (ejercicioSpecificProps as Omit<EjercicioCodigoType, 'pregunta' | 'tipo'>).codigoBase, resultadoEsperado: (ejercicioSpecificProps as Omit<EjercicioCodigoType, 'pregunta' | 'tipo'>).resultadoEsperado, feedbackSugerido: (ejercicioSpecificProps as Omit<EjercicioCodigoType, 'pregunta' | 'tipo'>).feedbackSugerido });
                  break;
                case 'opcionMultiple':
                  acc.push({id:ej.id, tipo: 'opcionMultiple', pregunta, respuestas: (ejercicioSpecificProps as Omit<EjercicioOpcionMultipleType, 'pregunta' | 'tipo'>).respuestas });
                  break;
                case 'quiz':
                  acc.push({id:ej.id, tipo: 'quiz', pregunta, respuestas: (ejercicioSpecificProps as Omit<EjercicioQuizType, 'pregunta' | 'tipo'>).respuestas });
                  break;
              }
              return acc;
            }, []);
        
            return {
              id: sub.id,
              tituloSubtitulo: sub.tituloSubtitulo,
              textoEnriquecido: sub.textoEnriquecido,
              orden: sub.orden,
              videoUrl: videoUrl,
              documentoUrl: documentoUrl,
              ejercicios: ejerciciosProcesados.map((ePayload, index: number): EjercicioPayloadItem => ({ ...ePayload, orden: index + 1 })),
            };
          })
        );

        const ejerciciosExamenProcesados: EjercicioType[] = (tema.examen?.ejerciciosExa || []).reduce((acc: EjercicioType[], ej: EjercicioType) => {
          const { pregunta, ...ejercicioSpecificProps } = ej;

          switch (ej.tipo) {
            case 'link':
              acc.push({id:ej.id, tipo: 'link', pregunta, url: (ejercicioSpecificProps as Omit<EjercicioLinkType, 'pregunta' | 'tipo'>).url });
              break;
            case 'codigo':
              acc.push({id:ej.id, tipo: 'codigo', pregunta, codigoBase: (ejercicioSpecificProps as Omit<EjercicioCodigoType, 'pregunta' | 'tipo'>).codigoBase, resultadoEsperado: (ejercicioSpecificProps as Omit<EjercicioCodigoType, 'pregunta' | 'tipo'>).resultadoEsperado, feedbackSugerido: (ejercicioSpecificProps as Omit<EjercicioCodigoType, 'pregunta' | 'tipo'>).feedbackSugerido });
              break;
            case 'opcionMultiple':
              acc.push({id:ej.id, tipo: 'opcionMultiple', pregunta, respuestas: (ejercicioSpecificProps as Omit<EjercicioOpcionMultipleType, 'pregunta' | 'tipo'>).respuestas });
              break;
            case 'quiz':
              acc.push({id:ej.id, tipo: 'quiz', pregunta, respuestas: (ejercicioSpecificProps as Omit<EjercicioQuizType, 'pregunta' | 'tipo'>).respuestas });
              break;
          }
          return acc;
        }, []);

        return {
          id: tema.id,
          tituloTema: tema.tituloTema,
          orden: tema.orden,
          subtitulos: subtitulosParaPayload,
          examen: tema.examen ? { ejerciciosExa: ejerciciosExamenProcesados.map((ePayload, index: number): EjercicioPayloadItem => ({ ...ePayload, orden: index + 1 })) } : { ejerciciosExa: [] },
        };
      })
    );

    const payload = {
      tituloCurso: cursoData.tituloCurso,
      idiomaCurso: cursoData.idiomaCurso,
      nivel: cursoData.nivel,
      licenciaCurso: cursoData.licenciaCurso,
      descripcion: cursoData.descripcion,
      imagenDestacada: imagenDestacadaUrl,
      temas: temasParaPayload
    };

    console.log('Payload FINAL para backend:', JSON.stringify(payload, null, 2));

    // Cuando estés listo para enviar al backend:
    try {
      if (courseId) {
        await updateCourse(parseInt(courseId), payload); // Call updateCourse
        toast.success('Curso actualizado correctamente');
      } else {
        toast.error('ID de curso no encontrado para la actualización.');
      }
      // Redirige o limpia el formulario si quieres
    } catch (error) {
      toast.error('Error al actualizar el curso');
      console.error('Error al actualizar el curso:', error);
    }
  };

  if (loadingCourse) {
    return <div className="text-center py-8">Cargando curso...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-background min-h-screen">
      <div className="max-w-11/12 mx-auto">
        <div className="flex justify-start mb-6">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold mb-8 ">Editar Curso</h1>


        <div className="mb-8 flex justify-center space-x-4">
          <Button
            onClick={currentStep === 2 ? pasoAnterior : undefined}

            className={`px-4 py-2 rounded-full text-sm font-medium
           ${currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600 hover:white'}`}>
            Paso 1: Información General
          </Button>
          <Button
            onClick={currentStep === 1 ? siguientePaso : undefined}
            className={`px-4 py-2 rounded-full text-sm font-medium 
           ${currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600 hover:white'}`}>
            Paso 2: Contenido del Curso
          </Button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-10">
          {currentStep === 1 && (
            <div className="p-6 border rounded-lg shadow-lg bg-background animate-fadeIn ">
              <h2 className="text-xl font-semibold mb-6 border-b pb-3">Información General del Curso</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="tituloCurso" className="block text-sm font-medium mb-1">Título del Curso <span className="text-red-500">*</span></label>
                  <Input id="tituloCurso" name="tituloCurso" value={cursoData.tituloCurso} onChange={handleInputChange} required className="shadow-sm" />
                </div>
                <div>
                  <label htmlFor="idiomaCurso" className="block text-sm font-medium mb-1">Idioma del Curso <span className="text-red-500">*</span></label>
                  <Select name="idiomaCurso" onValueChange={(value: string) => handleSelectChange('idiomaCurso', value as CursoDataType['idiomaCurso'])} value={cursoData.idiomaCurso || undefined} required>
                    <SelectTrigger className="shadow-sm"><SelectValue placeholder="Selecciona un idioma" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="español">Español</SelectItem>
                      <SelectItem value="quechua">Quechua</SelectItem>
                      <SelectItem value="aymara">Aymara</SelectItem>
                      <SelectItem value="guaraní">Guaraní</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="nivel" className="block text-sm font-medium mb-1">Nivel <span className="text-red-500">*</span></label>
                  <Select name="nivel" onValueChange={(value: string) => handleSelectChange('nivel', value as CursoDataType['nivel'])} value={cursoData.nivel || undefined} required>
                    <SelectTrigger className="shadow-sm"><SelectValue placeholder="Selecciona un nivel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="básico">Básico</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="licenciaCurso" className="block text-sm font-medium mb-1">Licencia del Curso <span className="text-red-500">*</span></label>
                  <Select name="licenciaCurso" onValueChange={(value: string) => handleSelectChange('licenciaCurso', value as CursoDataType['licenciaCurso'])} value={cursoData.licenciaCurso || undefined} required>
                    <SelectTrigger className="shadow-sm"><SelectValue placeholder="Selecciona una licencia" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC-BY">CC-BY</SelectItem>
                      <SelectItem value="CC-BY-SA">CC-BY-SA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="descripcion" className="block text-sm font-medium mb-1">Descripción <span className="text-red-500">*</span></label>
                <Textarea id="descripcion" name="descripcion" value={cursoData.descripcion} onChange={handleInputChange} rows={4} required className="shadow-sm" />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Imagen Destacada</label>
                <FileUpload
                  maxFiles={1}
                  accept=".jpg,.jpeg,.png,.gif"
                  onFilesChange={handleImagenDestacadaChange}
                />
                {cursoData.imagenDestacadaFile && <p className='text-sm mt-2 text-gray-600'>Archivo seleccionado: {cursoData.imagenDestacadaFile.name}</p>}
              </div>
              <div className="flex justify-end mt-8">
                <Button type="button" onClick={siguientePaso} size="lg" className="bg-primary" disabled={!isPaso1Completo()}>
                  Siguiente <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-6 border rounded-lg shadow-lg bg-background animate-fadeIn ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-primary">Temas del Curso</h2>
              </div>

              {cursoData.temas.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Aún no has agregado ningún tema. ¡Comienza añadiendo uno!</p>}

              <Accordion type="multiple" className="w-full space-y-1">
                {cursoData.temas.map((tema: TemaType) => (
                  <TemaComponent
                    key={tema.id}
                    tema={tema}
                    actualizarTituloTema={actualizarTituloTema}
                    eliminarTema={eliminarTema}
                    agregarSubtitulo={agregarSubtitulo}
                    actualizarSubtitulo={actualizarSubtitulo}
                    eliminarSubtitulo={eliminarSubtitulo}
                    handleSubtituloFileChange={handleSubtituloFileChange}
                    abrirModalEjercicio={abrirModalEjercicio}
                    eliminarEjercicioSubtitulo={eliminarEjercicioSubtitulo}
                    eliminarEjercicioExamen={eliminarEjercicioExamen}
                  />
                ))}
              </Accordion>
              <div className="flex justify-between mt-10">
                <Button type="button" onClick={pasoAnterior} size="lg" variant="outline">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Anterior
                </Button>
                <Button type="button" onClick={agregarTema} variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4 text-primary" /> Agregar Tema
                </Button>
                <Button type="submit" size="lg" className="bg-primary">
                  Guardar Curso
                </Button>
              </div>
            </div>
          )}
        </form>

        {modalState.isOpen && modalState.tipoContexto && (
          <EjercicioModal
            isOpen={modalState.isOpen}
            onClose={cerrarModalEjercicio}
            onSave={guardarEjercicio}
            ejercicioInicial={modalState.ejercicio}
            tipoContexto={modalState.tipoContexto}
          />
        )}
      </div>
    </div>
  );
};
