import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

const CodePlayground = () => {
  const [code, setCode] = useState(`
    () => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <p>Has hecho clic {count} veces</p>
          <button onClick={() => setCount(count + 1)}>Haz clic aquí</button>
        </div>
      );
    }
  `);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Espacio de Código</h1>
      <LiveProvider code={code}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold">Editor</h2>
            <LiveEditor onChange={(newCode) => setCode(newCode)} className="border rounded p-2" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Vista Previa</h2>
            <div className="border rounded p-2">
              <LivePreview />
            </div>
            <LiveError className="text-red-500" />
          </div>
        </div>
      </LiveProvider>
    </div>
  );
};

export default CodePlayground;
