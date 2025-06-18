import React, { useState } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import OutputPanel from '../OutputPanel';
import '../styles/editorTexto.css';
import ChatAssistant from "../../assistant/chatAssistant";
import { useToast } from '../../../components/ui/use-toast';

interface PyFile {
  name: string;
  content: string;
}

const initialFiles: PyFile[] = [
  { name: 'index.py', content: 'print("Hello, World!")' }
];

const EditorTexto: React.FC = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<PyFile[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<string>('index.py');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);

  const currentFile = files.find(f => f.name === selectedFile);

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const handleFileAdd = () => {
    const baseName = 'archivo';
    let idx = 1;
    let newName = `${baseName}${idx}.py`;
    while (files.some(f => f.name === newName)) {
      idx++;
      newName = `${baseName}${idx}.py`;
    }
    setFiles([...files, { name: newName, content: '' }]);
    setSelectedFile(newName);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setFiles(files.map(f =>
        f.name === selectedFile ? { ...f, content: value } : f
      ));
    }
  };

 const handleRunCode = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'python',
        version: '3.10.0',
        files: [
          {
            name: selectedFile,
            content: currentFile?.content || '',
          },
        ],
      }),
    });

    const data = await response.json();

    const stdout = data.run?.stdout || '';
    const stderr = data.run?.stderr || '';

    if (stderr) {
      setOutput(`⚠️ Error:\n${stderr}`);
    } else {
      setOutput(stdout);
    }
  } catch (error) {
    console.error('Error con Piston API:', error);
    setOutput('❌ Error ejecutando código en línea.');
  } finally {
    setIsLoading(false);
  }
};



  const handleSaveCode = () => {
    // Implementar la lógica de guardado
    console.log('Saving code:', currentFile?.content);
  };

  const handleRenameFile = (oldName: string, newName: string) => {
    if (!newName.endsWith('.py')) {
      toast.error('El archivo debe tener extensión .py');
      return;
    }
    if (files.some(f => f.name === newName && f.name !== oldName)) {
      toast.error('Ya existe un archivo con ese nombre');
      return;
    }
    setFiles(files.map(f => f.name === oldName ? { ...f, name: newName } : f));
    if (selectedFile === oldName) setSelectedFile(newName);
    setRenamingFile(null);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Gestor de archivos tipo Google Drive */}
      <div className="w-1/5 min-w-[180px] max-w-xs bg-gray-800 p-4 flex flex-col border-r border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Archivos</h2>
          <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700" onClick={handleFileAdd}>+</button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {files.map(file => (
            <li
              key={file.name}
              className={`p-2 rounded cursor-pointer mb-1 flex items-center justify-between ${selectedFile === file.name ? 'bg-blue-700 text-white' : 'hover:bg-gray-700'}`}
              onClick={() => handleFileSelect(file.name)}
            >
              <span className="flex items-center">
                <span className="mr-2">🐍</span>
                {renamingFile === file.name ? (
                  <input
                    type="text"
                    className="bg-gray-700 text-white rounded px-1 py-0.5 w-28 mr-2"
                    defaultValue={file.name}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                    onBlur={e => handleRenameFile(file.name, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleRenameFile(file.name, (e.target as HTMLInputElement).value);
                      } else if (e.key === 'Escape') {
                        setRenamingFile(null);
                      }
                    }}
                  />
                ) : (
                  <span>{file.name}</span>
                )}
              </span>
              <button
                className="ml-2 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded px-1 py-0.5"
                onClick={e => {
                  e.stopPropagation();
                  setRenamingFile(file.name);
                }}
                title="Renombrar archivo"
              >
                ✏️
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Editor y consola */}
      <div className="flex-1 flex flex-col">
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
              value={currentFile?.content || ''}
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
         {/* Chat Assistant */}
    <div className="h-[250px] overflow-y-auto bg-gray-800 border-t border-gray-700">
      <ChatAssistant />
    </div>
      </div>
    
    
    </div>
    
  );
};

export default EditorTexto;
