import React from "react";
import { useEffect, useState } from "react";
import { listModels } from "../services/modelsService";
import {
  getAdvancedSettings,
  saveAdvancedSettings,
} from "../services/settingsService";

interface SettingsProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [param, setParam] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    listModels()
      .then(setModels)
      .catch((err: unknown) => {
        let message = "Failed to list models";
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }
        setError(message);
      })
      .finally(() => setLoading(false));
    getAdvancedSettings().then((settings: { param: string }) => {
      setParam(settings.param || "");
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await saveAdvancedSettings({ param });
    } catch {
      setSaveError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="model-select">
          Model Selection
        </label>
        {loading ? (
          <div>Loading models...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <select
            id="model-select"
            className="border p-2 rounded"
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            aria-label="Select model"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="param-input">
          Advanced Parameter
        </label>
        <input
          id="param-input"
          className="border p-2 rounded"
          type="text"
          value={param}
          onChange={(e) => setParam(e.target.value)}
          aria-label="Advanced parameter"
        />
        <div className="text-xs text-gray-500 mt-1">
          (Example: set model hyperparameters or user preferences here)
        </div>
        <button
          className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saveError && <div className="text-red-600 mt-1">{saveError}</div>}
      </div>
      <p>Domain-specific model configuration will be available here.</p>
    </div>
  );
};

export default Settings;
