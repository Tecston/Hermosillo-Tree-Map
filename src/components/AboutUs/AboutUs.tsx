// File: src/components/AboutUs/AboutUs.tsx
import React from "react";
import HistoryTimeline from "../Timeline/HistoryTimeline";
import { Users, Target, Eye, Award, Building2, Handshake } from "lucide-react";

const AboutUs: React.FC = () => (
  <div className="min-h-full w-full bg-white border border-gray-100 p-6 rounded-lg space-y-8">
    {/* Timeline de historia */}
    <HistoryTimeline />

    {/* Sección Sobre Nosotros */}
    <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Sobre Nosotros</h2>
      </div>

      <p className="text-gray-600 text-lg leading-relaxed mb-6">
        Somos un equipo multidisciplinario que busca empoderar a la ciudadanía
        de Hermosillo para mejorar la calidad de vida urbana mediante
        participación directa, datos abiertos y soluciones tecnológicas.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Misión</h3>
          </div>
          <p className="text-gray-600">
            Fomentar la colaboración ciudadana para la mejora de espacios
            públicos.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Visión</h3>
          </div>
          <p className="text-gray-600">
            Una ciudad sostenible y participativa donde cada voz cuenta.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-4">Nuestros Valores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-700">Transparencia</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-700">Colaboración</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-700">Sostenibilidad</span>
          </div>
        </div>
      </div>
    </section>

    {/* Alianzas y Logros */}
    <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-lg">
          <Building2 className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Alianzas y Logros</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Handshake className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">
              Alianzas Estratégicas
            </h4>
          </div>
          <p className="text-gray-600">
            Colaboramos con el Ayuntamiento de Hermosillo y el COE Sonora Norte.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Impacto</h4>
          </div>
          <p className="text-gray-600">
            Hasta hoy contamos con 200 usuarios activos en sesiones piloto y más
            de 500 reportes ciudadanos.
          </p>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-9 text-white rounded-lg hover:bg-blue-10 transition-colors duration-200 shadow-sm">
        <Handshake className="w-5 h-5" />
        Contáctanos
      </button>
    </section>
  </div>
);

export default AboutUs;
