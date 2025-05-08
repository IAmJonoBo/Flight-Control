import { render, screen } from '@testing-library/react';
import Settings from './Settings';

describe('Settings', () => {
  it('renders model selection dropdown', () => {
    const models = [
      { name: 'graphcodebert', display_name: 'GraphCodeBERT', description: 'Test model', config_schema: {} },
      { name: 'lora', display_name: 'LoRA', description: 'LoRA model', config_schema: {} },
    ];
    render(
      <Settings selectedModel={models[0].name} onModelChange={() => {}} />
    );
    expect(screen.getByLabelText(/Model Selection/i)).toBeInTheDocument();
  });
});