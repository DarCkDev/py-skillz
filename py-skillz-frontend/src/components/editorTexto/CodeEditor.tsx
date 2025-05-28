import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <div className="h-full w-full">
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
  );
} 