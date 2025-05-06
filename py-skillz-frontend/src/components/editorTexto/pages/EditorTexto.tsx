import React, { useState } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import OutputPanel from '../OutputPanel';
import '../styles/editorTexto.css';

const EditorTexto: React.FC = () => {
  const [code, setCode] = useState<string>('print("Hello, World!")');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/python/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setOutput(data.output);
      } else {
        setOutput(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error details:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : 'Failed to run code. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCode = () => {
    // Implementar la lógica de guardado
    console.log('Saving code:', code);
  };

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button 
          className="editor-button run-button" 
          onClick={handleRunCode}
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run'}
        </button>
        <button 
          className="editor-button save-button" 
          onClick={handleSaveCode}
          disabled={isLoading}
        >
          Save
        </button>
      </div>
      <div className="editor-content">
        <div className="editor-wrapper">
          <MonacoEditor
            height="calc(100vh - 60px)"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
        <OutputPanel output={output} />
      </div>
    </div>
  );
};

export default EditorTexto; 