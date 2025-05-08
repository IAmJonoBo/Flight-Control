import { useEffect, useState } from 'react';
import { listModels } from '../services/modelsService';

interface SettingsProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

// TODO: Implement advanced settings UI and backend integration
const Settings: React.FC<SettingsProps> = ({ selectedModel, onModelChange }) => {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listModels()
      .then(setModels)
      .catch(err => setError(err.toString()))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Model Selection</label>
        {loading ? (
          <div>Loading models...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <select
            className="border p-2 rounded"
            value={selectedModel}
            onChange={e => onModelChange(e.target.value)}
          >
            {models.map(model => (
              <option key={model.name} value={model.name}>
                {model.display_name || model.name} - {model.description}
              </option>
            ))}
          </select>
        )}
      </div>
      <p>Domain-specific model configuration will be available here.</p>
    </div>
  );
};

export default Settings;