import React from "react";
import AlliancesHistory from "./AlliancesHistory";

const Resources: React.FC = () => (
  <div className="space-y-8 p-6 bg-gray-50">
    {/* Instrucciones paso a paso */}
    <section className="bg-white rounded-lg border border-gray-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Cómo usar la plataforma</h2>
      <ol className="list-decimal list-inside space-y-3 text-gray-700">
        <li>
          <strong>Crear un reporte:</strong> Haz clic en “+ Reporte”, completa
          el formulario y sube una foto.
        </li>
        <li>
          <strong>Apoyar reportes:</strong> En el mapa, selecciona la petición y
          pulsa “Apoyar”.
        </li>
        <li>
          <strong>Comentar:</strong> Abre la tarjeta de la petición o proyecto y
          escribe tu comentario.
        </li>
      </ol>
    </section>

    {/* Panel de estadísticas clave */}
    <section className="bg-white rounded-lg border border-gray-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Estadísticas Clave</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-4xl font-bold text-blue-600">120</p>
          <p className="text-gray-600">Peticiones activas</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-green-600">45</p>
          <p className="text-gray-600">Proyectos en curso</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-purple-600">550</p>
          <p className="text-gray-600">Comentarios realizados</p>
        </div>
      </div>
    </section>

    {/* Blog y artículos */}
    <section className="bg-white rounded-lg border border-gray-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Artículos y Noticias</h2>
      <ul className="space-y-3 text-gray-700">
        <li>✅ Cómo la participación ciudadana transformó un parque local</li>
        <li>✅ Guía rápida para documentar baches y problemas de alumbrado</li>
        <li>✅ Caso de éxito: Renovación de la Plaza Central</li>
      </ul>
    </section>

    {/* Preguntas frecuentes */}
    <section className="bg-white rounded-lg border border-gray-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
      <div className="space-y-4">
        <details>
          <summary className="cursor-pointer text-gray-800 font-medium">
            ¿Cómo creo una cuenta?
          </summary>
          <p className="mt-2 text-gray-600">
            Haz clic en “Registrarse” arriba a la derecha y sigue los pasos.
          </p>
        </details>
        <details>
          <summary className="cursor-pointer text-gray-800 font-medium">
            ¿Puedo editar mi reporte?
          </summary>
          <p className="mt-2 text-gray-600">
            Sí, ve a tu perfil y selecciona “Mis reportes” para editar o
            eliminar.
          </p>
        </details>
      </div>
    </section>

    {/* Historial de Alianzas */}
    <AlliancesHistory />

    {/* Contacto y redes */}
    <section className="bg-white rounded-lg border border-gray-6 p-6">
      <h2 className="text-2xl font-bold mb-4">Contacto y Redes</h2>
      <p className="text-gray-700 mb-4">
        Escríbenos a{" "}
        <a href="mailto:soporte@ciudadparticipa.mx" className="text-blue-600">
          soporte@ciudadparticipa.mx
        </a>{" "}
        o síguenos en:
      </p>
      <div className="flex space-x-4">
        <a href="#" className="text-blue-500 hover:underline">
          Instagram
        </a>
        <a href="#" className="text-blue-700 hover:underline">
          Facebook
        </a>
        <a href="#" className="text-blue-400 hover:underline">
          Twitter
        </a>
        <a href="#" className="text-blue-600 hover:underline">
          LinkedIn
        </a>
      </div>
    </section>
  </div>
);

export default Resources;
