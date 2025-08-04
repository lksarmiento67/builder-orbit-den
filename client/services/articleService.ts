import { Article, ArticleSummary } from "@shared/types";

export class ArticleService {
  private static instance: ArticleService;
  private articlesCache: ArticleSummary[] | null = null;
  private articleContentCache: Map<string, Article> = new Map();

  static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }
    return ArticleService.instance;
  }

  /**
   * Obtiene la lista de artículos desde el índice
   */
  async getArticles(): Promise<ArticleSummary[]> {
    // Usar cache si está disponible
    if (this.articlesCache) {
      return this.articlesCache;
    }

    try {
      console.log("🔄 Loading articles from index...");
      const response = await fetch("/articles/index.json");

      if (!response.ok) {
        console.warn("Articles index not found, using fallback data");
        return this.getMockArticles();
      }

      const articles = await response.json();
      console.log(`📚 Loaded ${articles.length} articles successfully`);

      // Actualizar cache
      this.articlesCache = articles;
      return articles;
    } catch (error) {
      console.error("Error loading articles:", error);
      console.log("📝 Using mock data as fallback");
      return this.getMockArticles();
    }
  }

  /**
   * Método alternativo para cargar artículos si el índice falla
   */
  private async loadArticlesAlternative(): Promise<ArticleSummary[]> {
    console.log("🔄 Intentando método alternativo de carga...");

    // Intentar cargar algunos artículos comunes
    const commonSlugs = [
      "10-tips-optimizar-javascript",
      "guia-completa-react-hooks",
      "api-rest-vs-graphql",
      "docker-para-developers",
    ];

    const foundArticles: ArticleSummary[] = [];

    for (const slug of commonSlugs) {
      try {
        const article = await this.getArticleBySlug(slug);
        if (article) {
          foundArticles.push({
            id: article.id,
            title: article.title,
            summary: article.summary,
            author: article.author,
            publishedAt: article.publishedAt,
            tags: article.tags,
            category: article.category,
            readTime: article.readTime,
            slug: article.slug,
            featured: foundArticles.length === 0,
          });
        }
      } catch (error) {
        console.warn(`Could not load article: ${slug}`);
      }
    }

    if (foundArticles.length > 0) {
      console.log(
        `📖 Found ${foundArticles.length} articles via alternative method`,
      );
      return foundArticles;
    }

    console.log("📝 Using mock data as fallback");
    return this.getMockArticles();
  }

  /**
   * Obtiene un artículo completo por su slug
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    // Verificar cache
    if (this.articleContentCache.has(slug)) {
      console.log(`📋 Article ${slug} loaded from cache`);
      return this.articleContentCache.get(slug)!;
    }

    try {
      // Intentar cargar el artículo generado con cache-busting
      const response = await fetch(`/articles/${slug}.html?v=${Date.now()}`);

      if (!response.ok) {
        console.warn(
          `📄 Article file ${slug}.html not found (${response.status})`,
        );
        return this.getMockArticle(slug);
      }

      const htmlContent = await response.text();

      if (!htmlContent || htmlContent.trim().length === 0) {
        console.warn(`📄 Article ${slug} is empty`);
        return this.getMockArticle(slug);
      }

      const article = this.parseArticleFromHtml(htmlContent, slug);

      if (article) {
        this.articleContentCache.set(slug, article);
        console.log(`✅ Article ${slug} loaded and cached successfully`);
      } else {
        console.warn(`⚠️ Failed to parse article ${slug}`);
        return this.getMockArticle(slug);
      }

      return article;
    } catch (error) {
      console.error(`❌ Error loading article ${slug}:`, error);
      return this.getMockArticle(slug);
    }
  }

  /**
   * Filtrar artículos por categoría
   */
  async getArticlesByCategory(category: string): Promise<ArticleSummary[]> {
    const articles = await this.getArticles();
    return articles.filter((article) => article.category === category);
  }

  /**
   * Buscar artículos por término
   */
  async searchArticles(searchTerm: string): Promise<ArticleSummary[]> {
    const articles = await this.getArticles();
    const term = searchTerm.toLowerCase();

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(term) ||
        article.summary.toLowerCase().includes(term) ||
        article.tags.some((tag) => tag.toLowerCase().includes(term)),
    );
  }

  /**
   * Invalidar cache (útil para desarrollo)
   */
  clearCache(): void {
    this.articlesCache = null;
    this.articleContentCache.clear();
  }

  /**
   * Parsear artículo desde HTML generado
   */
  private parseArticleFromHtml(html: string, slug: string): Article | null {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const title = doc.querySelector("h1")?.textContent || "";
      const summary = doc.querySelector(".summary")?.textContent || "";
      const author = doc.querySelector(".author")?.textContent || "DevTips Bot";
      const publishedAt =
        doc.querySelector("time")?.getAttribute("datetime") ||
        new Date().toISOString();
      const readTimeElement =
        doc.querySelector(".read-time")?.textContent || "5 min";
      const readTime = parseInt(readTimeElement.match(/\d+/)?.[0] || "5");
      const category = doc.querySelector(".category")?.textContent || "general";

      // Extraer tags
      const tagElements = doc.querySelectorAll(".tag");
      const tags = Array.from(tagElements).map((tag) => tag.textContent || "");

      // Extraer contenido principal
      const contentElement = doc.querySelector(".article-content");
      const content = contentElement?.innerHTML || "";

      // Extraer metadatos SEO
      const seoTitle = doc.querySelector("title")?.textContent || title;
      const seoDescription =
        doc
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") || summary;

      return {
        id: Date.now().toString(),
        title,
        summary,
        content,
        author,
        publishedAt,
        tags,
        category: category as Article["category"],
        readTime,
        slug,
        seoTitle,
        seoDescription,
      };
    } catch (error) {
      console.error("Error parsing article HTML:", error);
      return null;
    }
  }

  /**
   * Datos mock para desarrollo/fallback
   */
  private getMockArticles(): ArticleSummary[] {
    return [
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
  }

  private getMockArticle(slug: string): Article | null {
    const mockData: { [key: string]: Article } = {
      "10-tips-optimizar-javascript": {
        id: "1",
        title: "10 Tips para Optimizar tu Código JavaScript",
        summary:
          "Descubre las mejores prácticas para escribir JavaScript más eficiente y mantenible.",
        content: `
          <h3>Introducción</h3>
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

          <h3>Conclusión</h3>
          <p>Implementar estos tips en tu código JavaScript te ayudará a escribir código más limpio, eficiente y mantenible.</p>
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

    return mockData[slug] || null;
  }
}

// Export singleton instance
export const articleService = ArticleService.getInstance();
