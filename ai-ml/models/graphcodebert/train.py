import argparse
import os
from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
import torch
from datasets import load_dataset  # type: ignore

def load_data(dataset_path=None):
    if dataset_path and os.path.exists(dataset_path):
        dataset = load_dataset("json", data_files=dataset_path)
        train_data = dataset["train"] if "train" in dataset else dataset["train"]
        texts = train_data["code"]
        labels = train_data["label"] if "label" in train_data.features else [0]*len(texts)
        return texts, labels
    # Fallback to dummy data
    return ["def foo(): pass", "def bar(): return 1"], [0, 1]

def main():
    parser = argparse.ArgumentParser(description="Train GraphCodeBERT on a code dataset.")
    parser.add_argument("--dataset_path", type=str, default=None, help="Path to JSON dataset file.")
    parser.add_argument("--output_dir", type=str, default="./results", help="Directory to save model.")
    parser.add_argument("--epochs", type=int, default=1, help="Number of training epochs.")
    args = parser.parse_args()

    train_texts, train_labels = load_data(args.dataset_path)
    model_name = "microsoft/graphcodebert-base"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)

    train_encodings = tokenizer(train_texts, truncation=True, padding=True)
    class DummyDataset(torch.utils.data.Dataset):
        def __init__(self, encodings, labels):
            self.encodings = encodings
            self.labels = labels
        def __getitem__(self, idx):
            item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
            item['labels'] = torch.tensor(self.labels[idx])
            return item
        def __len__(self):
            return len(self.labels)

    dataset = DummyDataset(train_encodings, train_labels)

    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=2,
        logging_dir=os.path.join(args.output_dir, "logs"),
        logging_steps=10,
        save_strategy="epoch",
        evaluation_strategy="no",
        report_to=[],
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
    )

    trainer.train()
    # Simple validation: evaluate on train set (for demo)
    eval_result = trainer.evaluate()
    print(f"Validation result: {eval_result}")
    # Save model
    model.save_pretrained(args.output_dir)
    tokenizer.save_pretrained(args.output_dir)
    print(f"Model and tokenizer saved to {args.output_dir}")

if __name__ == "__main__":
    main()