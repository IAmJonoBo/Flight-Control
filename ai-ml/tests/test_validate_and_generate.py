from unittest.mock import patch, mock_open, MagicMock
import json
from ..models.synthetic import generate, validate

def test_generate_synthetic_samples():
    samples = generate.generate_synthetic_samples(3, ["god_method", "long_parameter_list"])
    assert len(samples) == 3
    for s in samples:
        assert "code" in s and "smell" in s and "severity" in s

def test_validate_samples(monkeypatch):
    # Prepare dummy input/output
    input_samples = [{"code": "def foo(): pass", "smell": "god_method"}]
    reference_samples = [{"code": "def bar(): pass"}]
    m = mock_open(read_data=json.dumps(input_samples))
    m_ref = mock_open(read_data=json.dumps(reference_samples))
    output = {}
    def fake_open(path, *args, **kwargs):
        if "input" in path:
            return m(path, *args, **kwargs)
        elif "reference" in path:
            return m_ref(path, *args, **kwargs)
        else:
            class DummyFile:
                def write(self, data):
                    output["data"] = data
                def __enter__(self): return self
                def __exit__(self, exc_type, exc_val, exc_tb): pass
            return DummyFile()
    monkeypatch.setattr("builtins.open", fake_open)
    monkeypatch.setattr(validate, "run_semgrep_on_code", lambda code, rules: True)
    monkeypatch.setattr(validate, "validate_with_codebertscore", lambda code, ref: 0.9)
    validate.validate_samples("input.json", "rules.yaml", "reference.json", "output.json")
    assert "data" in output
    report = json.loads(output["data"])
    assert isinstance(report, list)
    assert report[0]["semgrep_valid"] is True
    assert report[0]["codebertscore"] == 0.9