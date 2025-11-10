import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { blogPosts, searchBlogPosts } from "../../data/blog/posts";

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Get available categories based on current posts
  const availableCategories = useMemo(() => {
    const categories = new Set(blogPosts.map((post) => post.category));
    return Array.from(categories);
  }, []);

  const posts = useMemo(() => {
    let filteredPosts = searchQuery ? searchBlogPosts(searchQuery) : blogPosts;

    // Apply category filter
    if (selectedCategory !== "Todos") {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === selectedCategory
      );
    }

    // Apply sorting
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.publishDate).getTime();
      const dateB = new Date(b.publishDate).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filteredPosts;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre las últimas noticias, análisis y tendencias sobre
            desarrollo urbano y participación ciudadana
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue appearance-none"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center text-gray-500">
                  <Filter className="w-5 h-5 mr-2" />
                  Categorías:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("Todos")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === "Todos"
                        ? "bg-brand-blue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Todos
                  </button>
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-brand-blue text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Ordenar por:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      sortBy === "newest"
                        ? "bg-brand-blue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Más recientes
                  </button>
                  <button
                    onClick={() => setSortBy("oldest")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      sortBy === "oldest"
                        ? "bg-brand-blue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Más antiguos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-blue-darker text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {post.author.name}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.publishDate).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{post.tags.length - 2} más
                      </span>
                    )}
                  </div>
                )}

                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-brand-blue hover:text-brand-blue-darker font-medium"
                >
                  Leer más
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* No results message */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No se encontraron artículos
            </h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o categorías
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
