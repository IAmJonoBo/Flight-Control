from unittest.mock import patch, MagicMock
import sys
import types
import importlib


def test_graphcodebert_train_runs():
    # Patch transformers and torch to avoid real downloads/training
    with patch.dict(sys.modules, {
        "transformers": types.SimpleNamespace(
            AutoModelForSequenceClassification=MagicMock(return_value=MagicMock()),
            AutoTokenizer=MagicMock(return_value=MagicMock()),
            Trainer=MagicMock(return_value=MagicMock(train=lambda x: None)),  # type: ignore
            TrainingArguments=MagicMock()
        ),
        "torch": types.SimpleNamespace(
            utils=types.SimpleNamespace(data=types.SimpleNamespace(Dataset=object)),
            tensor=lambda x: x  # type: ignore
        )
    }):
        # Use importlib to import module with dash in path
        train_mod = importlib.import_module("ai-ml.models.graphcodebert.train")  # type: ignore
        # Should not raise


def test_lora_train_runs():
    with patch.dict(sys.modules, {
        "transformers": types.SimpleNamespace(
            models=types.SimpleNamespace(
                auto=types.SimpleNamespace(
                    modeling_auto=types.SimpleNamespace(AutoModelForSequenceClassification=MagicMock(return_value=MagicMock())),
                    tokenization_auto=types.SimpleNamespace(AutoTokenizer=MagicMock(return_value=MagicMock())),
                )
            ),
            Trainer=MagicMock(return_value=MagicMock(train=lambda x: None)),  # type: ignore
            TrainingArguments=MagicMock()
        ),
        "datasets": types.SimpleNamespace(load_dataset=MagicMock(return_value={"train": []})),
        "peft_utils": types.SimpleNamespace(
            create_lora_model=MagicMock(return_value=MagicMock()),
            save_lora_adapter=MagicMock(),
            apply_spectral_regularization=MagicMock(return_value=0.0)
        )
    }):
        lora_mod = importlib.import_module("ai-ml.models.lora.train_lora")  # type: ignore
        # Should not raise