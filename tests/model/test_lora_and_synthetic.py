import os
import json
import tempfile
from ai-ml.models.lora import peft_utils
from ai-ml.models.synthetic import generate

def test_create_lora_model():
    class DummyModel:
        def __init__(self):
            self.parameters = lambda: iter([])
    model = DummyModel()
    lora_model = peft_utils.create_lora_model(model, r=2, alpha=4, dropout=0.1, target_modules=["q_proj"])
    assert lora_model is not None

def test_generate_synthetic_samples():
    samples = generate.generate_synthetic_samples(5, ["god_method", "long_parameter_list"])
    assert len(samples) == 5
    for s in samples:
        assert "code" in s and "smell" in s and "severity" in s

def test_generate_and_validate_pipeline():
    with tempfile.TemporaryDirectory() as tmpdir:
        out_path = os.path.join(tmpdir, "samples.json")
        # Generate
        samples = generate.generate_synthetic_samples(3, ["god_method"])
        with open(out_path, "w") as f:
            json.dump(samples, f)
        # Validate (mock: just check file exists and is valid JSON)
        with open(out_path) as f:
            loaded = json.load(f)
        assert isinstance(loaded, list)
        assert all("code" in s for s in loaded)