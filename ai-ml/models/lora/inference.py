import os
import torch
from transformers.models.auto.modeling_auto import AutoModelForSequenceClassification  # type: ignore
from transformers.models.auto.tokenization_auto import AutoTokenizer  # type: ignore
from peft_utils import load_lora_adapter  # type: ignore

# Configurable paths (could be set via env or config)
BASE_MODEL = os.getenv("LORA_BASE_MODEL", "microsoft/graphcodebert-base")
ADAPTER_PATH = os.getenv("LORA_ADAPTER_PATH", "ai-ml/models/lora/adapter")

# Load model and tokenizer once at module level
_tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)  # type: ignore
_base_model = AutoModelForSequenceClassification.from_pretrained(BASE_MODEL)  # type: ignore
_model = load_lora_adapter(_base_model, ADAPTER_PATH)  # type: ignore
_model.eval()  # type: ignore
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
_model.to(_device)  # type: ignore

def infer(code: str):
    inputs = _tokenizer(code, return_tensors="pt", truncation=True, padding="max_length", max_length=256)  # type: ignore
    inputs = {k: v.to(_device) for k, v in inputs.items()}  # type: ignore
    with torch.no_grad():
        outputs = _model(**inputs)  # type: ignore
        logits = outputs.logits  # type: ignore
        predicted_class = int(torch.argmax(logits, dim=-1).item())  # type: ignore
        confidence = float(torch.softmax(logits, dim=-1).max().item())  # type: ignore
    return {"predicted_class": predicted_class, "confidence": confidence}