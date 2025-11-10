import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => (
  <section
    id="inicio"
    className="flex flex-col items-center justify-center min-h-dvh md:pt-16 pb-16 text-center px-6"
  >
    <h1 className="text-4xl lg:text-5xl xl:text-6xl md:w-3/4 font-extrabold text-foreground mb-2 md:mb-6 drop-shadow-lg">
      Tu mapa de ruta para materializar tu proyecto y crecer en tu ciudad.
    </h1>
    <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto drop-shadow-sm">
      Descubre los proyectos más destacados y conoce el desarrollo urbano de
      nuestra región.
    </p>
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <Link
        to="/dashboard"
        className="bg-brand-blue hover:bg-brand-blue-darker text-white font-semibold py-2 px-5 rounded-lg shadow-lg transform transition hover:scale-105 duration-200  lg:text-lg"
      >
        IR AL MAPA
      </Link>
      <a
        href="#contacto"
        className="border-2 border-white text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition hover:bg-white hover:text-brand-blue-darker duration-200 lg:text-lg"
      >
        CONTACTAR
      </a>
    </div>
  </section>
);

export default HeroSection;
