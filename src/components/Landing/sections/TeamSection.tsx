import React from "react";

const team = [
  {
    name: "Jesús Medina",
    role: "Gestión de Proyectos",
    desc: "Liderazgo en iniciativas sostenibles con base tecnológica.",
    img: "./profiles/jesus.jpeg",
    socials: [],
  },
  {
    name: "Gael Astorga",
    role: "Arquitecto Principal",
    desc: "Especialista en arquitectura sostenible adaptada al clima desértico de Sonora.",
    img: "./profiles/gael.png",
    socials: [],
  },
  {
    name: "Julieta López",
    role: "Marketing Estratégico",
    desc: "Activa el ecosistema emprendedor sonorense.",
    img: "./profiles/julieta.jpeg",
    socials: [],
  },
  {
    name: "Juan Ruíz",
    role: "Analista Financiero",
    desc: "Gestiona la viabilidad económica y optimiza recursos para proyectos con impacto social.",
    img: "./profiles/juan.jpeg",
    socials: [],
  },
  {
    name: "Marco Montoya",
    role: "Desarrollador Web",
    desc: "Desarrollador de interfaces web funcionales y centradas en la experiencia del usuario.",
    img: "./profiles/marco.jpeg",
    socials: [],
  },
];

const TeamSection: React.FC = () => (
  <section
    id="sobre-nosotros"
    className="w-full flex flex-col items-center py-24 bg-blue-50"
  >
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 text-center">
      Nuestro Equipo
    </h2>
    <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl">
      Conoce a los integrantes que hacen posible Ciudata
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-7xl px-4">
      {team.map((member) => (
        <div
          key={member.name}
          className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center border"
        >
          <img
            src={member.img}
            alt={member.name}
            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-100"
          />
          <h3 className="text-xl font-bold mb-1 text-center">{member.name}</h3>
          <div className="text-gray-500 mb-2 text-center font-medium">
            {member.role}
          </div>
          <div className="text-gray-600 text-center text-sm mb-4">
            {member.desc}
          </div>
          <div className="flex space-x-3 text-blue-400">
            {member.socials.includes("linkedin") && (
              <a href="#" aria-label="LinkedIn">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62z" />
                </svg>
              </a>
            )}
            {member.socials.includes("twitter") && (
              <a href="#" aria-label="Twitter">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636a9.936 9.936 0 0 0 2.457-2.548l-.047-.02z" />
                </svg>
              </a>
            )}
            {member.socials.includes("facebook") && (
              <a href="#" aria-label="Facebook">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {member.socials.includes("github") && (
              <a href="#" aria-label="GitHub">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {member.socials.includes("email") && (
              <a href="#" aria-label="Email">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12.713l-11.985-8.713h23.97l-11.985 8.713zm11.985-10.713h-23.97c-1.104 0-2 .896-2 2v16c0 1.104.896 2 2 2h23.97c1.104 0 2-.896 2-2v-16c0-1.104-.896-2-2-2zm-11.985 13.287l-11.985-8.713v14.426l11.985-5.713zm2.015 0l11.985 5.713v-14.426l-11.985 8.713z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TeamSection;
