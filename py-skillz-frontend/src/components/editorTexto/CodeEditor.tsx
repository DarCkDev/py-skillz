import React, { useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [, setSelectedFile] = useState<string | null>(null);

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
    const file = files.find(f => f.name === fileName);
    if (file) {
      onChange(file.content);
    }
  };

  const handleFileAdd = (fileName: string, content: string) => {
    setFiles([...files, { name: fileName, content }]);
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-1/4 bg-gray-800 p-4">
        <h2 className="text-white text-lg mb-4">Gestor de Archivos</h2>
        <ul>
          {files.map(file => (
            <li key={file.name} className="text-white cursor-pointer" onClick={() => handleFileSelect(file.name)}>
              {file.name}
            </li>
          ))}
        </ul>
        <button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handleFileAdd('newFile.py', '')}>
          Agregar Archivo
        </button>
      </div>
      <div className="w-3/4 h-full">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-white resize-none focus:outline-none"
          style={{
            tabSize: 4,
            lineHeight: '1.5',
          }}
        />
      </div>
    </div>
  );
} 