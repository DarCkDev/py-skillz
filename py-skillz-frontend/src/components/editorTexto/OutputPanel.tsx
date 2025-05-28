import React from 'react';

interface OutputPanelProps {
  output: string;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ output }) => {
  return (
    <div className="output-panel">
      <h3>Output</h3>
      <pre className={output.startsWith('Error') ? 'error' : 'success'}>
        {output || 'No output yet'}
      </pre>
    </div>
  );
};

export default OutputPanel; 