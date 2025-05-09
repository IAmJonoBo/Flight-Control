import torch
from peft import LoraConfig, get_peft_model, PeftModel, PeftConfig  # type: ignore
from transformers.modeling_utils import PreTrainedModel
from typing import Optional, List

def create_lora_model(base_model: PreTrainedModel, r: int = 8, alpha: int = 16, dropout: float = 0.1, target_modules: Optional[List[str]] = None) -> 'PeftModel':  # type: ignore
    config: 'LoraConfig' = LoraConfig(  # type: ignore
        r=r,
        lora_alpha=alpha,
        target_modules=target_modules or ["q_proj", "v_proj"],
        lora_dropout=dropout,
        bias="none",
        task_type="SEQ_CLS"
    )
    return get_peft_model(base_model, config)  # type: ignore

def save_lora_adapter(model: 'PeftModel', output_dir: str) -> None:  # type: ignore
    model.save_pretrained(output_dir)  # type: ignore

def load_lora_adapter(base_model: PreTrainedModel, adapter_dir: str) -> 'PeftModel':  # type: ignore
    config: 'PeftConfig' = PeftConfig.from_pretrained(adapter_dir)  # type: ignore
    return PeftModel.from_pretrained(base_model, adapter_dir, config=config)  # type: ignore

def apply_spectral_regularization(model: torch.nn.Module, lambda_sr: float = 1e-4) -> torch.Tensor:
    reg_loss = torch.tensor(0.0, device=next(model.parameters()).device)
    for name, param in model.named_parameters():
        if "lora" in name and param.dim() == 2:
            _, s, _ = torch.svd(param)  # u and v are unused
            reg_loss = reg_loss + lambda_sr * torch.sum((s - 1) ** 2)
    return reg_loss
