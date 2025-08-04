# 🤖 Configuración del Blog Automatizado con IA

Este proyecto incluye GitHub Actions que automáticamente generan artículos de programación usando Gemini AI y mantienen un sitemap actualizado.

## 🔧 Configuración Inicial

### 1. Configurar API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API Key para Gemini
3. En tu repositorio de GitHub, ve a `Settings > Secrets and variables > Actions`
4. Agrega un nuevo secret llamado `GEMINI_API_KEY` con tu API key

### 2. Configurar Dominio

Edita los siguientes archivos para usar tu dominio:

**`.github/workflows/update-sitemap.yml`** (línea 25):
```javascript
const baseUrl = 'https://tu-dominio.com'; // Cambiar por tu dominio
```

**`client/services/articleService.ts`** - Actualizar URLs si es necesario.

### 3. Permisos de GitHub Actions

En `Settings > Actions > General`, asegúrate de que:
- ✅ "Allow GitHub Actions to create and approve pull requests" está habilitado
- ✅ "Read and write permissions" está seleccionado para `GITHUB_TOKEN`

## 🚀 Funcionamiento

### Generación Automática de Artículos

- **Frecuencia**: Diariamente a las 10:00 AM UTC
- **Manual**: Puedes ejecutarlo manualmente desde la pestaña "Actions"
- **Contenido**: Artículos sobre temas de programación
- **Almacenamiento**: `public/articles/[slug].html`
- **Índice**: `public/articles/index.json`

### Actualización del Sitemap

- **Trigger**: Cada vez que se agrega un nuevo artículo
- **Archivos generados**: 
  - `public/sitemap.xml`
  - `public/robots.txt`

## 📝 Estructura de Archivos

```
public/
├── articles/
│   ├── index.json          # Índice de todos los artículos
│   ├── articulo-1.html     # Artículo generado
│   ├── articulo-2.html     # Artículo generado
│   └── ...
├── sitemap.xml             # Sitemap automático
└── robots.txt              # Robots.txt automático
```

## 🎯 Personalización

### Temas de Artículos

Edita el array `programmingTopics` en `.github/workflows/generate-articles.yml` para agregar más temas:

```javascript
const programmingTopics = [
  'Tu tema personalizado',
  'Otro tema interesante',
  // ... más temas
];
```

### Plantilla de Artículos

Modifica `templates/article-template.html` para cambiar la estructura HTML de los artículos.

### Categorías

Las categorías disponibles son:
- `general`
- `frontend` 
- `backend`
- `fullstack`
- `mobile`
- `devops`

## 🧪 Testing

### Ejecutar Manualmente

1. Ve a la pestaña "Actions" en GitHub
2. Selecciona "Generate Programming Articles"
3. Clica "Run workflow"
4. Opcional: Especifica un tema personalizado

### Verificar Resultados

1. Revisa que se hayan creado archivos en `public/articles/`
2. Verifica que `public/articles/index.json` se haya actualizado
3. Confirma que `public/sitemap.xml` incluye los nuevos artículos

## 🔍 SEO Features

### Metadatos Automáticos

Cada artículo incluye automáticamente:
- Meta description
- Meta keywords  
- Open Graph tags
- Structured data (JSON-LD)
- Canonical URLs

### Sitemap Features

- URLs de artículos con prioridad 0.9
- News sitemap para Google News
- Frecuencia de actualización optimizada
- Soporte para múltiples idiomas

## 🚨 Troubleshooting

### API Key Issues
- Verifica que el secret `GEMINI_API_KEY` esté configurado
- Asegúrate de que la API key tenga permisos suficientes

### Permisos de Git
- Confirma que GitHub Actions tiene permisos de escritura
- Revisa que no haya conflictos en el repositorio

### Contenido Generado
- Los artículos se generan en español por defecto
- Si no hay contenido, revisa los logs de GitHub Actions
- El contenido se cachea para mejorar performance

## 📊 Monitoreo

### Logs Importantes
- GitHub Actions logs para debugging
- Network tab para verificar carga de artículos
- Console logs para errores de parsing

### Métricas
- Número de artículos generados: `public/articles/index.json`
- SEO coverage: `public/sitemap.xml`
- Performance: Tiempo de carga del feed

## 🎨 Customización Avanzada

### Modificar el Prompt de IA

Edita el `prompt` variable en el GitHub Action para cambiar el estilo de los artículos:

```javascript
const prompt = `
Tu prompt personalizado aquí...
Incluye instrucciones específicas para:
- Tono de voz
- Estructura preferida  
- Ejemplos específicos
- Longitud del contenido
`;
```

### Agregar Más Metadatos

Extiende la interfaz `Article` en `shared/types.ts` para incluir campos adicionales como:
- `featuredImage`
- `relatedArticles`
- `difficulty`
- `estimatedTime`

¡Tu blog de programación está listo para generar contenido automáticamente! 🚀
