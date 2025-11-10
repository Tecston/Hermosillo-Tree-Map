import { BlogPost } from "../../components/Landing/sections/BlogSection";

// Define all available categories
export const BLOG_CATEGORIES = [
  "Urbanismo",
  "Tecnología",
  "Datos",
  "Participación Ciudadana",
  "Desarrollo Urbano",
  "Sostenibilidad",
  "Innovación",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

// Define all available tags
export const BLOG_TAGS = [
  "Urbanismo",
  "Tecnología",
  "Datos",
  "Participación Ciudadana",
  "Desarrollo Urbano",
  "Sostenibilidad",
  "Innovación",
  "Gobierno Digital",
  "Smart Cities",
  "Comunidad",
  "Análisis",
  "Tendencias",
  "Investigación",
  "Políticas Públicas",
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

// Define the authors
export const BLOG_AUTHORS = {
  equipoCiudata: {
    name: "Equipo Ciudata",
    avatar: "/logo.png",
    role: "Urbanista",
    bio: "Especialista en desarrollo urbano y participación ciudadana.",
  },
  carlosRodriguez: {
    name: "Carlos Rodríguez",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: "Analista de Datos",
    bio: "Experto en análisis de datos urbanos y visualización.",
  },
  mariaLopez: {
    name: "María López",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Investigadora",
    bio: "Investigadora en tecnologías urbanas y sostenibilidad.",
  },
} as const;

// All blog posts
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Prueba Piloto: Parque El Tazajal",
    excerpt:
      "Descubre como impacta la participacion ciudadana en la planificación de nuevos espacios...",
    content: `
      <p>La transformación urbana está en el centro de las discusiones sobre el futuro de nuestras ciudades. Con el rápido crecimiento de la población urbana y los desafíos que enfrentamos, es crucial repensar cómo diseñamos y gestionamos nuestros espacios urbanos.</p>

      <h2>El Papel de la Tecnología</h2>
      <p>La tecnología está jugando un papel fundamental en esta transformación. Desde sensores inteligentes hasta plataformas de participación ciudadana, las herramientas digitales están permitiendo una gestión más eficiente y una mayor participación de los ciudadanos en la toma de decisiones.</p>

      <h2>Participación Ciudadana</h2>
      <p>La participación ciudadana es clave para el éxito de cualquier iniciativa urbana. Las plataformas digitales como Ciudata están facilitando que los ciudadanos puedan expresar sus necesidades y contribuir al desarrollo de sus comunidades.</p>

      <h2>Análisis de Datos</h2>
      <p>El análisis de datos nos permite entender mejor las necesidades de la ciudad y tomar decisiones más informadas. Al recopilar y analizar datos sobre el uso del espacio público, la movilidad y otros aspectos urbanos, podemos identificar patrones y tendencias que nos ayudan a mejorar la calidad de vida en nuestras ciudades.</p>

      <h2>Conclusión</h2>
      <p>El futuro de nuestras ciudades depende de nuestra capacidad para integrar la tecnología, fomentar la participación ciudadana y utilizar los datos de manera efectiva. Plataformas como Ciudata están liderando este cambio, facilitando la colaboración entre ciudadanos, gobiernos y otros actores urbanos.</p>
    `,
    imageUrl: "/blog/taz/taz_01.jpeg",
    category: "Urbanismo",
    author: BLOG_AUTHORS.equipoCiudata,
    publishDate: "2025-03-15",
    readTime: "5 min",
    tags: [
      "Urbanismo",
      "Tecnología",
      "Participación Ciudadana",
      "Transformación de Espacios",
    ],
  },
  {
    id: "2",
    title: "Conoce a ciudata!",
    excerpt:
      "Conoce CIUDATA, una StartUp que busca unificar las necesidades de las personas con...",
    content: `
      <p>El objetivo de CIUDATA es brindar herramientas de análisis poderosas que reflejen las necesidades de habitantes a empresas que buscan impactar a la sociedad, a fin de mejorar la sostenibilidad de zonas y accesibilidad de los ciudadanos para expresar sus necesidades.</p>

      <h2>¿Cómo funciona?</h2>
      <p>Cualquier persona sube necesidades de su ciudad, en base a estos reportes se crean campañas, y CIUDATA digiere los datos y genera reportes para las empresas que quieran adoptar la campaña.</p>

      <p>Durante el proceso de desarrollo de una campaña, CIUDATA se encarga de evidenciar los cambios en las zonas, para dar veracidad y fomentar la transparencia de los proyectos, de esta manera los ciudadanos pueden ver el cambio y los proyectos que se han creado en su ciudad. </p>

      <h2>Participación Ciudadana</h2>
      <p>La participación ciudadana es clave para el éxito de cualquier iniciativa urbana. Las plataformas digitales como Ciudata están facilitando que los ciudadanos puedan expresar sus necesidades y contribuir al desarrollo de sus comunidades.</p>

      <h2>Análisis de Datos</h2>
      <p>El análisis de datos nos permite entender mejor las necesidades de la ciudad y tomar decisiones más informadas. Al recopilar y analizar datos sobre el uso del espacio público, la movilidad y otros aspectos urbanos, podemos identificar patrones y tendencias que nos ayudan a mejorar la calidad de vida en nuestras ciudades.</p>
    `,
    imageUrl: "/ciudata-full.svg",
    category: "Urbanismo",
    author: BLOG_AUTHORS.equipoCiudata,
    publishDate: "2025-03-04",
    readTime: "4 min",
    tags: [
      "Urbanismo",
      "Tecnología",
      "Participación Ciudadana",
      "Transformación de Espacios",
    ],
  },
];

// Helper functions to work with blog posts
export const getBlogPost = (id: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.id === id);
};

export const getBlogPostsByCategory = (category: BlogCategory): BlogPost[] => {
  return blogPosts.filter((post) => post.category === category);
};

export const getBlogPostsByTag = (tag: BlogTag): BlogPost[] => {
  return blogPosts.filter((post) => post.tags?.includes(tag));
};

export const getLatestPosts = (limit?: number): BlogPost[] => {
  const sortedPosts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  return limit ? sortedPosts.slice(0, limit) : sortedPosts;
};

export const searchBlogPosts = (query: string): BlogPost[] => {
  const searchTerm = query.toLowerCase();
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.category.toLowerCase().includes(searchTerm) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
};
