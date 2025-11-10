import React from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { getBlogPost } from "../../data/blog/posts";

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = id ? getBlogPost(id) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Artículo no encontrado
            </h1>
            <p className="text-gray-600 mb-8">
              Lo sentimos, el artículo que buscas no existe.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center text-brand-blue hover:text-brand-blue-darker"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-brand-blue hover:text-brand-blue-darker mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{post.author.name}</p>
              {post.author.role && (
                <p className="text-sm text-gray-600">{post.author.role}</p>
              )}
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(post.publishDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{post.readTime} de lectura</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          <div className="flex items-center space-x-4">
            <span className="bg-brand-blue-darker text-white px-4 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
        </header>

        {/* Featured image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-12">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Etiquetas relacionadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author bio */}
        {post.author.bio && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start space-x-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sobre {post.author.name}
                </h3>
                <p className="text-gray-600">{post.author.bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogPost;
