import React from "react";
import {IoLogoInstagram} from "react-icons/io";

const Footer: React.FC = () => (
  <footer
    id="contacto"
    className="w-full text-neutral-200 border-t bg-gray-800 border-neutral-800"
  >
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Main footer content in three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Company Info Column */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Ciudata</h3>
          <p className="text-neutral-400 text-sm mb-4 italic">
            "Transformando el futuro urbano de tu ciudad, un proyecto a la vez"
          </p>
        </div>

        {/* Contact Info Column */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>
          <div className="space-y-2 text-neutral-400 text-sm">
            <p>Email: marco.montoya@ciudata.solutions</p>
            <p>Teléfono: (662) 123-4567</p>
            <p>Dirección: Hermosillo, Sonora</p>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4">Enlaces Rápidos</h3>
          <div className="space-y-2 text-neutral-400 text-sm">
            <a href="#inicio" className="hover:text-white transition-colors">
              Inicio
            </a>
            <br />
            <a href="#mapa" className="hover:text-white transition-colors">
              Mapa
            </a>
            <br />
            <a
              href="#estadisticas"
              className="hover:text-white transition-colors"
            >
              Estadísticas
            </a>
            <br />
            <a href="#servicios" className="hover:text-white transition-colors">
              Servicios
            </a>
            <br />
            <a href="#contacto" className="hover:text-white transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar with copyright and social links */}
      <div className="border-t border-gray-8/50 pt-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-neutral-400 text-sm mb-4 md:mb-0">
          © 2025 Ciudata. Todos los derechos reservados.
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.instagram.com/ciudata.mx/"
            aria-label="LinkedIn"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <IoLogoInstagram />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
