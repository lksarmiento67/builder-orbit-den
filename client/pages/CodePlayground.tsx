import * as React from 'react';
import { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { themes } from 'prism-react-renderer';
import * as ButtonUI from "@/components/ui/button";
import * as CardUI from "@/components/ui/card";
import * as TabsUI from "@/components/ui/tabs";
import * as LucideIcons from 'lucide-react';

const { Code2, Copy, Play, RefreshCw, Save, Share2 } = LucideIcons;
import * as Sonner from "sonner";
import { toast } from "sonner";

// Componente de botón simple para usar en el editor
const SimpleButton = ({ children, ...props }) => (
  <button 
    {...props}
    style={{
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      ...props.style
    }}
  >
    {children}
  </button>
);

// Componente de tarjeta simple para usar en el editor
const SimpleCard = ({ children, style = {} }) => (
  <div 
    style={{
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      padding: '1.5rem',
      ...style
    }}
  >
    {children}
  </div>
);

// Scope para el LiveProvider
const scope = {
  React,
  useState,
  useEffect,
  Button: SimpleButton,
  Card: SimpleCard,
  // Iconos
  Code2, Copy, Play, RefreshCw, Save, Share2,
  // Utilidades
  toast: (msg) => console.log(msg) // Usar console.log en lugar de toast para simplificar
};

// Ejemplos de código
const codeExamples = {
  contador: `// Contador simple con React Hooks
() => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold mb-4">Contador: {count}</h2>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Incrementar
        </button>
        <button 
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}`,

  formulario: `// Formulario de contacto
() => {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = React.useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Contáctanos</h2>
      {submitted ? (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          ¡Mensaje enviado con éxito!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mensaje</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Enviar mensaje
          </button>
        </form>
      )}
    </div>
  );
}`,

  tarjeta: `// Tarjeta de producto
() => {
  const [liked, setLiked] = React.useState(false);
  
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
          alt="Producto"
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">Auriculares Inalámbricos</h3>
          <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
            $199.99
          </span>
        </div>
        <p className="text-gray-600 mb-4">
          Auriculares con cancelación de ruido y hasta 30 horas de batería.
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-400">★</span>
            )}
            <span className="text-sm text-gray-500 ml-1">(128)</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}`
};

const CodePlayground = () => {
  const [code, setCode] = React.useState(codeExamples.contador);
  const [selectedExample, setSelectedExample] = React.useState('contador');
  const [isRunning, setIsRunning] = React.useState(true);
  const [isCopied, setIsCopied] = React.useState(false);

  // Cargar el código guardado del localStorage al iniciar
  useEffect(() => {
    const savedCode = localStorage.getItem('savedCode');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Copiar código al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Guardar código en localStorage
  const saveCode = () => {
    localStorage.setItem('savedCode', code);
    toast.success('Código guardado correctamente');
  };

  // Restablecer código al ejemplo seleccionado
  const resetCode = () => {
    setCode(codeExamples[selectedExample]);
    toast.info('Código restablecido');
  };

  // Manejar cambio de ejemplo
  const handleExampleChange = (example) => {
    setSelectedExample(example);
    setCode(codeExamples[example]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Espacio de Código</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Experimenta con React en tiempo real. Escribe tu código en el editor y ve los resultados al instante.
          </p>
        </div>

        {/* Selector de ejemplos */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Ejemplos:</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(codeExamples).map((example) => (
              <button
                key={example}
                onClick={() => handleExampleChange(example)}
                className={`px-3 py-1 text-sm rounded-md capitalize ${
                  selectedExample === example
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gray-50 border-b px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Editor de Código</h2>
                <p className="text-sm text-gray-500">
                  {selectedExample === 'contador' && 'Un contador interactivo con React Hooks'}
                  {selectedExample === 'formulario' && 'Un formulario de contacto funcional'}
                  {selectedExample === 'tarjeta' && 'Una tarjeta de producto interactiva'}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={resetCode}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </button>
                <button
                  onClick={saveCode}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Guardar</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={isCopied}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md ${
                    isCopied
                      ? 'bg-green-100 border-green-200 text-green-800'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>

          <LiveProvider code={code} scope={{
            React,
            ...ButtonUI,
            ...CardUI,
            ...TabsUI,
            ...LucideIcons,
            ...Sonner,
            toast
          }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Editor */}
              <div className="relative h-[500px] overflow-auto">
                <div className="sticky top-0 bg-gray-800 text-white px-4 py-2 text-sm font-mono flex justify-between items-center">
                  <span>editor.jsx</span>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  </div>
                </div>
                <LiveEditor
                  onChange={setCode}
                  className="h-[calc(100%-40px)] text-sm"
                  theme={themes.github}
                />
              </div>

              {/* Vista previa */}
              <div className="border-l border-gray-200 h-[500px] overflow-auto bg-white">
                <div className="sticky top-0 bg-gray-50 border-b px-4 py-2 text-sm font-medium flex justify-between items-center">
                  <span>Vista previa</span>
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Reiniciar</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Ejecutar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4">
                  {isRunning ? (
                    <LivePreview className="h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      La vista previa está pausada. Haz clic en "Ejecutar" para ver los cambios.
                    </div>
                  )}
                  <LiveError className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded" />
                </div>
              </div>
            </div>
          </LiveProvider>
        </div>

        {/* Sección de recursos */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recursos útiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Documentación</h3>
                <p className="text-gray-600 mb-4">Aprende más sobre React y sus características.</p>
                <a
                  href="https://reactjs.org/docs/getting-started.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Ver documentación
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Ejemplos</h3>
                <p className="text-gray-600 mb-4">Explora más ejemplos de código con React.</p>
                <a
                  href="https://reactjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Ver ejemplos
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Comunidad</h3>
                <p className="text-gray-600 mb-4">Únete a la comunidad de desarrolladores de React.</p>
                <div className="flex gap-2">
                  <a
                    href="https://github.com/facebook/react"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://discord.gg/reactiflux"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-gray-900">DevTips</span>
            </div>
            <p className="text-sm text-gray-500">
              {new Date().getFullYear()} DevTips. Todos los derechos reservados.
            </p>
            
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              © {new Date().getFullYear()} DevTips. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CodePlayground;
