import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Code2,
  Search,
  Clock,
  User,
  BookOpen,
  Filter,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ArticleSummary } from "@shared/types";

// Mock data - esto será reemplazado por data real de los archivos generados
const mockArticles: ArticleSummary[] = [
  {
    id: "1",
    title: "10 Tips para Optimizar tu Código JavaScript",
    summary:
      "Descubre las mejores prácticas para escribir JavaScript más eficiente y mantenible. Desde el uso correcto de async/await hasta técnicas de optimización de performance que todo developer debería conocer.",
    author: "DevTips Bot",
    publishedAt: "2024-01-15T10:00:00Z",
    tags: ["JavaScript", "Performance", "Best Practices"],
    category: "frontend",
    readTime: 5,
    slug: "10-tips-optimizar-javascript",
    featured: true,
  },
  {
    id: "2",
    title: "Guía Completa de React Hooks",
    summary:
      "Todo lo que necesitas saber sobre React Hooks. useState, useEffect, useContext y hooks personalizados explicados con ejemplos prácticos y casos de uso reales.",
    author: "DevTips Bot",
    publishedAt: "2024-01-14T15:30:00Z",
    tags: ["React", "Hooks", "Frontend"],
    category: "frontend",
    readTime: 8,
    slug: "guia-completa-react-hooks",
  },
  {
    id: "3",
    title: "API REST vs GraphQL: ¿Cuál Elegir?",
    summary:
      "Comparativa detallada entre REST y GraphQL. Analizamos las ventajas, desventajas y casos de uso ideales para cada tecnología con ejemplos reales.",
    author: "DevTips Bot",
    publishedAt: "2024-01-13T09:15:00Z",
    tags: ["API", "REST", "GraphQL", "Backend"],
    category: "backend",
    readTime: 6,
    slug: "api-rest-vs-graphql",
  },
  {
    id: "4",
    title: "Docker para Developers: Primeros Pasos",
    summary:
      "Introducción práctica a Docker. Aprende a containerizar tus aplicaciones, crear Dockerfiles eficientes y orquestar servicios con docker-compose.",
    author: "DevTips Bot",
    publishedAt: "2024-01-12T14:20:00Z",
    tags: ["Docker", "DevOps", "Containerization"],
    category: "devops",
    readTime: 7,
    slug: "docker-para-developers",
  },
];

const categories = [
  { id: "all", name: "Todos", icon: BookOpen },
  { id: "frontend", name: "Frontend", icon: Code2 },
  { id: "backend", name: "Backend", icon: TrendingUp },
  { id: "fullstack", name: "Full Stack", icon: Zap },
  { id: "mobile", name: "Mobile", icon: User },
  { id: "devops", name: "DevOps", icon: Filter },
];

// Static articles data for read-only blog
const staticArticles: ArticleSummary[] = [
  {
    id: "1",
    title: "10 Tips para Optimizar tu Código JavaScript",
    summary:
      "Descubre las mejores prácticas para escribir JavaScript más eficiente y mantenible. Desde el uso correcto de async/await hasta técnicas de optimización de performance que todo developer debería conocer.",
    author: "DevTips Bot",
    publishedAt: "2024-01-15T10:00:00Z",
    tags: ["JavaScript", "Performance", "Best Practices"],
    category: "frontend",
    readTime: 5,
    slug: "10-tips-optimizar-javascript",
    featured: true,
  },
  {
    id: "2",
    title: "Guía Completa de React Hooks",
    summary:
      "Todo lo que necesitas saber sobre React Hooks. useState, useEffect, useContext y hooks personalizados explicados con ejemplos prácticos y casos de uso reales.",
    author: "DevTips Bot",
    publishedAt: "2024-01-14T15:30:00Z",
    tags: ["React", "Hooks", "Frontend"],
    category: "frontend",
    readTime: 8,
    slug: "guia-completa-react-hooks",
  },
  {
    id: "3",
    title: "API REST vs GraphQL: ¿Cuál Elegir?",
    summary:
      "Comparativa detallada entre REST y GraphQL. Analizamos las ventajas, desventajas y casos de uso ideales para cada tecnología con ejemplos reales.",
    author: "DevTips Bot",
    publishedAt: "2024-01-13T09:15:00Z",
    tags: ["API", "REST", "GraphQL", "Backend"],
    category: "backend",
    readTime: 6,
    slug: "api-rest-vs-graphql",
  },
  {
    id: "4",
    title: "Docker para Developers: Primeros Pasos",
    summary:
      "Introducción práctica a Docker. Aprende a containerizar tus aplicaciones, crear Dockerfiles eficientes y orquestar servicios con docker-compose.",
    author: "DevTips Bot",
    publishedAt: "2024-01-12T14:20:00Z",
    tags: ["Docker", "DevOps", "Containerization"],
    category: "devops",
    readTime: 7,
    slug: "docker-para-developers",
  },
  {
    id: "5",
    title: "TypeScript: Tipos Avanzados y Utility Types",
    summary:
      "Domina TypeScript con tipos avanzados, mapped types, conditional types y utility types. Ejemplos prácticos para llevar tu código al siguiente nivel.",
    author: "DevTips Bot",
    publishedAt: "2024-01-11T11:45:00Z",
    tags: ["TypeScript", "Advanced Types", "Frontend"],
    category: "frontend",
    readTime: 9,
    slug: "typescript-tipos-avanzados",
  },
  {
    id: "6",
    title: "Node.js Performance: Optimización y Profiling",
    summary:
      "Técnicas avanzadas para optimizar aplicaciones Node.js. Profiling, cluster mode, worker threads y mejores prácticas para aplicaciones de alto rendimiento.",
    author: "DevTips Bot",
    publishedAt: "2024-01-10T13:20:00Z",
    tags: ["Node.js", "Performance", "Backend", "Optimization"],
    category: "backend",
    readTime: 10,
    slug: "nodejs-performance-optimization",
  },
];

export default function Index() {
  const [articles] = useState<ArticleSummary[]>(staticArticles);
  const [filteredArticles, setFilteredArticles] =
    useState<ArticleSummary[]>(staticArticles);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading] = useState(false);

  // Filter articles when category or search term changes
  useEffect(() => {
    let filtered = articles;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory,
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DevTips</h1>
                <p className="text-xs text-gray-600">Tips de Programación</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar tips..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "bg-brand-600 hover:bg-brand-700"
                      : ""
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mb-6 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar tips..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Featured Article */}
        {filteredArticles.find((article) => article.featured) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-brand-600" />
              Destacado
            </h2>
            {(() => {
              const featured = filteredArticles.find(
                (article) => article.featured,
              )!;
              return (
                <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-brand-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-brand-600 text-white text-xs">
                          DT
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {featured.author}
                        </p>
                        <div className="flex items-center text-xs text-gray-600 space-x-2">
                          <span>{formatDate(featured.publishedAt)}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {featured.readTime} min
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-brand-600 text-white">
                        Destacado
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-900 leading-tight">
                      {featured.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {featured.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featured.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        asChild
                        className="bg-brand-600 hover:bg-brand-700"
                      >
                        <Link to={`/articulo/${featured.slug}`}>
                          Ver artículo completo
                        </Link>
                      </Button>
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <BookOpen className="w-4 h-4" />
                        <span>Artículo destacado</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Cargando artículos de programación...
            </p>
          </div>
        )}

        {/* Articles Feed */}
        {!loading && (
          <div className="space-y-6">
            {filteredArticles
              .filter((article) => !article.featured)
              .map((article) => (
                <Card
                  key={article.id}
                  className="border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-brand-600 text-white text-xs">
                          DT
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {article.author}
                        </p>
                        <div className="flex items-center text-xs text-gray-600 space-x-2">
                          <span>{formatDate(article.publishedAt)}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {article.readTime} min
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-900 leading-tight">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {article.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button variant="outline" asChild>
                        <Link to={`/articulo/${article.slug}`}>Ver más</Link>
                      </Button>
                      <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron artículos
            </h3>
            <p className="text-gray-600">
              Intenta cambiar los filtros o el término de búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
