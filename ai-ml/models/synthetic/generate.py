# Placeholder for synthetic data generation script

import argparse
import os
import json
import random
from typing import List, Dict, Any

# Example code smell templates (expand as needed)
CODE_SMELL_TEMPLATES: Dict[str, str] = {
    "god_method": "def god_method():\n    # Too many responsibilities\n    a = 1\n    b = 2\n    c = 3\n    d = 4\n    e = 5\n    f = 6\n    g = 7\n    h = 8\n    i = 9\n    j = 10\n    return a + b + c + d + e + f + g + h + i + j\n",
    "long_parameter_list": "def foo(a, b, c, d, e, f, g, h, i, j):\n    return a + b + c + d + e + f + g + h + i + j\n",
    "duplicate_code": "def duplicate1():\n    x = 1\n    y = 2\n    return x + y\n\ndef duplicate2():\n    x = 1\n    y = 2\n    return x + y\n",
}

SEVERITIES = ["low", "medium", "high", "critical"]


def generate_synthetic_samples(num_samples: int, smells: List[str]) -> List[Dict[str, Any]]:
    samples: List[Dict[str, Any]] = []
    for _ in range(num_samples):
        smell = random.choice(smells)
        code = CODE_SMELL_TEMPLATES.get(smell, "")
        if not code:
            continue
        sample: Dict[str, Any] = {
            "code": code,
            "smell": smell,
            "severity": random.choice(SEVERITIES),
        }
        samples.append(sample)
    return samples

def main():
    parser = argparse.ArgumentParser(description="Generate synthetic code samples with code smells.")
    parser.add_argument("--output", type=str, required=True, help="Output JSON file path.")
    parser.add_argument("--num_samples", type=int, default=100, help="Number of samples to generate.")
    parser.add_argument("--smells", type=str, nargs="*", default=list(CODE_SMELL_TEMPLATES.keys()), help="Code smells to include.")
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    samples = generate_synthetic_samples(args.num_samples, args.smells)
    with open(args.output, "w") as f:
        json.dump(samples, f, indent=2)
    print(f"Generated {len(samples)} synthetic samples to {args.output}")

if __name__ == "__main__":
    main()