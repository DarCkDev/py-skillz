"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Code, Users, Globe, BookOpen, Play, Star, Award, Zap } from "lucide-react"

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      title: "Aprende Python en Bolivia",
      subtitle: "Plataforma con compilador inteligente",
      description: "Domina Python con nuestro compilador que detecta errores en tiempo real usando AI",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Python yatiqaña Bolivia markan",
      subtitle: "AI yanapampi compilador ukampi",
      description: "Python yatiqañataki AI yanapampi pantjañanaka jikxatañataki",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Python yachay Boliviapi",
      subtitle: "AI yanapaywan compilador kaqwan",
      description: "Python programacionta yachay AI yanapaywan pantaykunata tarinapaq",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Compilador con AI",
      description: "Compilador de Python integrado que detecta errores en tiempo real con inteligencia artificial",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Cursos Completos",
      description: "Cada curso incluye videos, exámenes, tareas y proyectos prácticos",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Comunidad Activa",
      description: "Conecta con profesores y estudiantes de toda Bolivia",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "4 Idiomas Nativos",
      description: "Disponible en Español, Quechua, Aymara y Guaraní",
    },
  ]

  const roles = [
    {
      title: "Estudiantes",
      description: "Aprende Python desde cero con nuestro compilador inteligente y cursos estructurados",
      features: [
        "Compilador con AI",
        "Videos interactivos",
        "Exámenes y tareas",
        "Proyectos reales",
        "Certificaciones",
      ],
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      title: "Profesores",
      description: "Enseña Python con herramientas avanzadas y seguimiento del progreso estudiantil",
      features: [
        "Panel de control",
        "Creación de cursos",
        "Seguimiento detallado",
        "Recursos didácticos",
        "Evaluaciones automáticas",
      ],
      gradient: "from-cyan-400 to-teal-400",
    },
  ]

  const languages = [
    { name: "Español", flag: "🇪🇸", users: "2.1M+" },
    { name: "Quechua", flag: "🦙", users: "1.2M+" },
    { name: "Aymara", flag: "🏔️", users: "850K+" },
    { name: "Guaraní", flag: "🌿", users: "650K+" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>

        <div className="relative w-full max-w-7xl mx-auto px-6">
          <div className="relative h-96 rounded-3xl overflow-hidden">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentSlide
                    ? "translate-x-0"
                    : index < currentSlide
                      ? "-translate-x-full"
                      : "translate-x-full"
                }`}
              >
                <div className="h-full bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-sm rounded-3xl flex items-center justify-between p-12">
                  <div className="flex-1 text-white">
                    <h1 className="text-6xl font-bold mb-4 leading-tight">{slide.title}</h1>
                    <h2 className="text-2xl font-semibold mb-6 text-blue-100">{slide.subtitle}</h2>
                    <p className="text-xl mb-8 text-blue-50 max-w-2xl">{slide.description}</p>
                    <div className="flex gap-4">
                      <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Comenzar Ahora
                      </button>
                      <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                        Ver Demo
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-96 h-64 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Características Principales</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre todas las herramientas que hacen de nuestra plataforma la mejor opción para aprender Python
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:bg-white/60 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-blue-100/50 to-cyan-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Para Todos los Roles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma está diseñada para satisfacer las necesidades de cada usuario
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {roles.map((role, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/30 hover:bg-white/70 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`bg-gradient-to-r ${role.gradient} w-full h-32 rounded-2xl mb-6 flex items-center justify-center`}
                >
                  <div className="text-white text-4xl font-bold">{role.title.charAt(0)}</div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">{role.title}</h3>
                <p className="text-gray-600 text-lg mb-6">{role.description}</p>
                <ul className="space-y-3">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <Star className="w-5 h-5 text-yellow-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">Educación Inclusiva</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aprende en tu idioma nativo y conecta con tu cultura
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {languages.map((lang, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/60 to-blue-50/60 backdrop-blur-md rounded-3xl p-8 border border-white/30 hover:from-white/80 hover:to-blue-50/80 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl text-center"
              >
                <div className="text-6xl mb-4">{lang.flag}</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">{lang.name}</h3>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold text-lg">
                  {lang.users} usuarios
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">¡Comienza tu Viaje en Python Hoy!</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de estudiantes bolivianos que ya están programando con nuestro compilador inteligente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <Zap className="w-6 h-6 inline mr-2" />
              Registrarse Gratis
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
              <Award className="w-6 h-6 inline mr-2" />
              Ver Certificaciones
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
