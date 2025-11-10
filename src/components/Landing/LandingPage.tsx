import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AppProvider } from "../../context/AppContext";
import { Menu, X } from "lucide-react";
import Footer from "../Footer";
import HeroSection from "./sections/HeroSection";
import MapSection from "./sections/MapSection";
import SectorStatsSection from "./sections/SectorStatsSection";
import FeaturedTopicsSection from "./sections/FeaturedTopicsSection";
import ServiciosSection from "./sections/ServiciosSection";
import TeamSection from "./sections/TeamSection";
import BlogSection from "./sections/BlogSection";
// import AboutCiudata from "./sections/AboutCiudata.tsx";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Mapa", href: "#mapa" },
  { label: "Estadísticas", href: "#estadisticas" },
  { label: "Servicios", href: "#servicios" },
  { label: "Blog", href: "#blog" },
  { label: "Sobre Nosotros", href: "#sobre-nosotros" },
  { label: "Contacto", href: "#contacto" },
];

const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        sectionsRef.current[entry.target.id] = entry;
      });
      const visibleSections = Object.values(sectionsRef.current).filter(
        (entry) => entry.isIntersecting
      );
      if (visibleSections.length > 0) {
        const mostVisibleSection = visibleSections.reduce((prev, current) => {
          return prev.intersectionRatio > current.intersectionRatio
            ? prev
            : current;
        });
        setActiveSection(mostVisibleSection.target.id);
      }
    }, observerOptions);
    NAV_LINKS.forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) {
        observer.observe(section);
      }
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("inicio");
      if (hero) {
        const rect = hero.getBoundingClientRect();
        setIsOverHero(rect.bottom > 200);
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.querySelector("nav");
      if (nav && !nav.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <AppProvider>
      <div
        className="min-h-dvh w-full relative flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,20,40,0.7),rgba(20,20,40,0.7)), url(https://cdn.pixabay.com/photo/2021/04/09/02/09/hermosillo-6163195_1280.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <nav className="w-full bg-gray-800 sticky top-0 z-[999] 2xl:hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Ciudata logo"
                  className="size-6 mb-0.5 mr-1"
                />
                <span className="text-xl font-bold tracking-wide text-white">
                  <p className={`font-logo font-medium text-brand-blue`}>
                    Ciudata
                  </p>
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="2xl:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            <div
              className={`2xl:hidden transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "max-h-[500px] opacity-100 visible"
                  : "max-h-0 opacity-0 invisible"
              } overflow-hidden`}
            >
              <div className="py-4 space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={handleNavClick}
                      className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "text-white bg-gray-700"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
                <Link
                  to="/dashboard"
                  onClick={handleNavClick}
                  className="block mt-4 px-4 py-2 text-center rounded-lg bg-brand-blue hover:bg-brand-blue-darker text-white transition-all duration-300 text-sm font-medium"
                >
                  IR AL MAPA
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <nav
          className={`fixed left-0 top-0 h-full z-50 hidden 2xl:flex flex-col items-start justify-center pl-12`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative mt-24">
            <div
              className={`absolute -left-8 top-1 pb-10 -translate-y-1/2 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
            >
              <span
                className={`text-xl font-bold tracking-wide flex items-center flex-row whitespace-nowrap ${
                  isOverHero ? "text-white" : "text-gray-800"
                }`}
              >
                <img
                  src="/logo-alt.png"
                  alt="Ciudata logo"
                  className="size-7 mb-0.5 mr-1"
                />
                <p className={`font-logo font-medium text-brand-blue`}>
                  Ciudata
                </p>
              </span>
            </div>
            <ul className="space-y-6">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <li key={link.href} className="relative group">
                    <a
                      href={link.href}
                      className={`flex items-center space-x-4 transition-all duration-300 px-2 py-1 rounded-lg ${
                        isOverHero
                          ? isActive
                            ? "text-white scale-110"
                            : "text-white/60 hover:text-white"
                          : isActive
                          ? "text-gray-800 scale-110"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                      style={{ minWidth: 120 }}
                    >
                      <div
                        className={`absolute -left-6 top-1/2 -translate-y-1/2 h-0.5 transition-all duration-300 ${
                          isActive
                            ? isOverHero
                              ? "w-4 bg-white"
                              : "w-4 bg-gray-800"
                            : "w-0 group-hover:w-4 bg-gray-800/60"
                        }`}
                      />
                      <span className="font-medium tracking-wide text-sm">
                        {link.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div
              className={`mt-8 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
            >
              <Link
                to="/dashboard"
                className={`font-medium py-2 px-4 rounded-full backdrop-blur-xs transition-all duration-300 text-sm inline-block ${
                  isOverHero
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-900/10 hover:bg-gray-900/20 text-gray-800"
                }`}
              >
                Ir al mapa
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1 pt-16 lg:pt-0">
          <div className="fixed bottom-3 right-4 z-50 w-fit rounded-full bg-brand-blue" onClick={() => setIsHovered(false)}>

              <Link
                to="/dashboard"
                className={`font-medium py-2 px-4 rounded-full text-white transition-all duration-300 hover:text-white hover:bg-brand-blue-darker hidden xl:inline-block`}

              >
                Ir al mapa
              </Link>
          </div>
          <HeroSection />
          {/*<AboutCiudata />*/}
          <MapSection />
          <SectorStatsSection />
          <FeaturedTopicsSection />
          {/* <UrbanStatsSection/> */}
          <ServiciosSection />
          <BlogSection />
          <TeamSection />
        </main>
      </div>
      <Footer />
    </AppProvider>
  );
};

export default LandingPage;
