import React from "react";
import { useState, useEffect } from "react";
import CodeEditor from "../components/CodeEditor";
import { useGit } from "../hooks/useGit";
import { useAnalysis } from "../hooks/useAnalysis";
import Settings from "./Settings";
import { useModels } from "../hooks/useModels";

const initialCode = `def example():
    print('Hello, Flight Control!')
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const Dashboard = () => {
  const [code, setCode] = useState(initialCode);
  const [repoUrl, setRepoUrl] = useState("");
  const { models, fetchModels } = useModels();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const {
    result: gitResult,
    loading: gitLoading,
    error: gitError,
    clone,
  } = useGit();
  const {
    result: analysisResult,
    loading: analysisLoading,
    error: analysisError,
    analyze,
  } = useAnalysis();

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

  // Debounced analysis
  useEffect(() => {
    const debounced = debounce(analyze, 600);
    if (code && code.trim().length >= 3 && selectedModel) {
      debounced(code, selectedModel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, selectedModel]);

  const handleClone = () => {
    if (repoUrl.trim()) {
      clone(repoUrl);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center">
      <img src="/vite.svg" alt="Flight Control Logo" className="w-24 mb-4" />
      <h1 className="text-3xl font-bold text-brand-dark mb-2">
        Flight Control Dashboard
      </h1>
      <Settings
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      <div className="mb-6 w-full max-w-md">
        <label className="block mb-2 font-medium">Clone a Git Repository</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="border p-2 rounded flex-1"
            placeholder="https://github.com/octocat/Hello-World.git"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            disabled={gitLoading}
          />
          <button
            className="bg-brand text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleClone}
            disabled={gitLoading || !repoUrl.trim()}
          >
            {gitLoading ? "Cloning..." : "Clone"}
          </button>
        </div>
        {gitError && <div className="text-red-600 mt-2">{gitError}</div>}
        {gitResult && gitResult.success && (
          <div className="text-green-700 mt-2">Cloned to: {gitResult.path}</div>
        )}
      </div>
      <div className="w-full max-w-2xl mb-4">
        <CodeEditor value={code} onChange={setCode} />
        {analysisLoading && (
          <div className="text-blue-600 mt-2">Analyzing...</div>
        )}
        {analysisError && (
          <div className="text-red-600 mt-2">{analysisError}</div>
        )}
        {analysisResult && (
          <div className="mt-2 text-green-700">
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
