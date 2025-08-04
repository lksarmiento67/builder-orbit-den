import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Calendar, BookOpen, Code2 } from "lucide-react";
import { Article } from "@shared/types";
import { articleService } from "@/services/articleService";

// Mock data - esto será reemplazado por la carga real del archivo HTML
const mockArticles: { [key: string]: Article } = {
  "10-tips-optimizar-javascript": {
    id: "1",
    title: "10 Tips para Optimizar tu Código JavaScript",
    summary:
      "Descubre las mejores prácticas para escribir JavaScript más eficiente y mantenible.",
    content: `
      <h2>Introducción</h2>
      <p>JavaScript es uno de los lenguajes más populares del mundo, pero escribir código eficiente requiere conocer las mejores prácticas. En este artículo exploraremos 10 tips fundamentales para optimizar tu código JavaScript.</p>
      
      <h3>1. Usa const y let en lugar de var</h3>
      <p>Las declaraciones <code>const</code> y <code>let</code> tienen un scope de bloque, lo que evita muchos problemas comunes con <code>var</code>.</p>
      <pre><code>// ❌ Evitar
var message = "Hello";

// ✅ Mejor
const message = "Hello";
let counter = 0;</code></pre>

      <h3>2. Utiliza Arrow Functions cuando sea apropiado</h3>
      <p>Las arrow functions son más concisas y mantienen el contexto de <code>this</code>.</p>
      <pre><code>// ❌ Función tradicional
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(num) {
  return num * 2;
});

// ✅ Arrow function
const doubled = numbers.map(num => num * 2);</code></pre>

      <h3>3. Implementa Destructuring</h3>
      <p>El destructuring hace que tu código sea más legible y eficiente.</p>
      <pre><code>// ❌ Sin destructuring
const user = { name: 'Juan', email: 'juan@email.com' };
const name = user.name;
const email = user.email;

// ✅ Con destructuring
const { name, email } = user;</code></pre>

      <h3>4. Usa Template Literals</h3>
      <p>Los template literals son más legibles que la concatenación de strings.</p>
      <pre><code>// ❌ Concatenación
const message = "Hola " + name + ", tienes " + count + " mensajes";

// ✅ Template literal
const message = \`Hola \${name}, tienes \${count} mensajes\`;</code></pre>

      <h3>5. Maneja Promesas con async/await</h3>
      <p>async/await hace que el código asíncrono sea más legible que los callbacks o .then().</p>
      <pre><code>// ❌ Con .then()
fetchUser()
  .then(user => {
    return fetchPosts(user.id);
  })
  .then(posts => {
    console.log(posts);
  });

// ✅ Con async/await
async function getUserPosts() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  console.log(posts);
}</code></pre>

      <h3>6. Evita el Callback Hell</h3>
      <p>Usa Promises o async/await para evitar callbacks anidados excesivamente.</p>

      <h3>7. Implementa Error Handling apropiado</h3>
      <p>Siempre maneja errores en operaciones asíncronas.</p>
      <pre><code>async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}</code></pre>

      <h3>8. Usa métodos de Array modernos</h3>
      <p>Métodos como map(), filter(), reduce() son más expresivos que los loops tradicionales.</p>

      <h3>9. Optimiza el rendimiento con debouncing</h3>
      <p>Para eventos que se disparan frecuentemente, usa debouncing para mejorar el rendimiento.</p>

      <h3>10. Mantén tu código DRY (Don't Repeat Yourself)</h3>
      <p>Extrae funcionalidad común en funciones reutilizables.</p>

      <h2>Conclusión</h2>
      <p>Implementar estos tips en tu código JavaScript te ayudará a escribir código más limpio, eficiente y mantenible. Recuerda que la práctica constante es clave para dominar estas técnicas.</p>
    `,
    author: "DevTips Bot",
    publishedAt: "2024-01-15T10:00:00Z",
    tags: ["JavaScript", "Performance", "Best Practices"],
    category: "frontend",
    readTime: 5,
    slug: "10-tips-optimizar-javascript",
    seoTitle:
      "10 Tips para Optimizar tu Código JavaScript - Mejores Prácticas 2024",
    seoDescription:
      "Descubre las mejores prácticas para escribir JavaScript más eficiente. Tips sobre async/await, destructuring, arrow functions y más.",
    featured: true,
  },
};

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return;

      try {
        const foundArticle = await articleService.getArticleBySlug(slug);
        setArticle(foundArticle);
      } catch (error) {
        console.error("Error loading article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Link>
            </Button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Artículo no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El artículo que buscas no existe o ha sido movido.
          </p>
          <Button asChild>
            <Link to="/">Volver al blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al blog
              </Link>
            </Button>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>📚 Blog de Programación</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article>
          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Badge variant="outline" className="mb-4 capitalize">
                {article.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Author and Meta Info */}
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-brand-600 text-white">
                    DT
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{article.author}</p>
                  <div className="flex items-center text-sm text-gray-600 space-x-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(article.publishedAt)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime} min de lectura
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Artículo de programación</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none prose-gray prose-headings:text-gray-900 prose-code:text-brand-600 prose-code:bg-brand-50 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            {/* Related Articles */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Code2 className="w-5 h-5 text-brand-600" />
                  <h3 className="text-lg font-semibold">
                    Más artículos de programación
                  </h3>
                </div>
                <p className="text-gray-600">
                  Explora nuestra colección de artículos sobre desarrollo, tips
                  y mejores prácticas.
                </p>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/">📚 Ver todos los artículos</Link>
                </Button>
              </CardContent>
            </Card>
          </footer>
        </article>
      </main>
    </div>
  );
}
