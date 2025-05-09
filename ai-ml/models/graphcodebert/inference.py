import os

if os.getenv("FC_TEST_MODE"):
    def infer(code: str, model_name: str = None):
        return {"predicted_class": 1, "confidence": 0.99}
else:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch

    model_name = "microsoft/graphcodebert-base"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)

    def infer(code: str, model_name: str = None):
        inputs = tokenizer(code, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            predicted_class = int(torch.argmax(logits, dim=1).item())
            confidence = float(torch.softmax(logits, dim=1).max().item())
        return {"predicted_class": predicted_class, "confidence": confidence}

if __name__ == "__main__":
    print(infer("def foo(): pass"))