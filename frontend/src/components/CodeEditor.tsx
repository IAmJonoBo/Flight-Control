import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { CloseAction, ErrorAction } from 'vscode-languageclient';
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';

// LSP server WebSocket URL (adjust as needed)
const LSP_WS_URL = 'ws://localhost:5007';

function registerPythonLanguage() {
  monaco.languages.register({
    id: 'python',
    extensions: ['.py'],
    aliases: ['Python', 'py'],
  });
}

function createPythonModel(value: string) {
  return monaco.editor.createModel(
    value,
    'python',
    monaco.Uri.parse(`file:///main.py`)
  );
}

function connectToLsp() {
  const webSocket = new WebSocket(LSP_WS_URL);
  webSocket.onopen = () => {
    const socket = toSocket(webSocket as WebSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const languageClient = new MonacoLanguageClient({
      name: 'Python Language Client',
      clientOptions: {
        documentSelector: ['python'],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        },
      },
      connectionProvider: {
        get: async () => ({ reader, writer }),
      },
    } as any);
    languageClient.start();
    reader.onClose(() => languageClient.stop());
  };
}

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  metrics?: { lines_of_code: number; cyclomatic_complexity: number };
};

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, metrics }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    registerPythonLanguage();
    if (editorRef.current && !monacoRef.current) {
      const model = createPythonModel(value);
      monacoRef.current = monaco.editor.create(editorRef.current, {
        model,
        language: 'python',
        theme: 'vs-light',
        automaticLayout: true,
      });
      monacoRef.current.onDidChangeModelContent(() => {
        onChange(monacoRef.current.getValue());
      });
      connectToLsp();
    }
    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
        monacoRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (monacoRef.current && value !== monacoRef.current.getValue()) {
      monacoRef.current.setValue(value);
    }
  }, [value]);

  // TODO: Support multiple languages and LSP servers in the future
  // TODO: Add fallback for when LSP server is unavailable
  // TODO: Ensure accessibility (tab order, ARIA, focus management)

  return (
    <div>
      <div ref={editorRef} style={{ height: 300, border: '1px solid #e5e7eb', borderRadius: 4 }} />
      {metrics && (
        <div className="mt-2 text-sm text-gray-600">
          <span>Lines of Code: {metrics.lines_of_code}</span> |{' '}
          <span>Cyclomatic Complexity: {metrics.cyclomatic_complexity}</span>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;