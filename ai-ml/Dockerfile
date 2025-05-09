FROM python:3.10-slim

WORKDIR /app

# Create non-root user
RUN useradd -m appuser && chown appuser /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY models ./models
COPY data ./data
COPY notebooks ./notebooks

USER appuser

CMD ["python", "models/graphcodebert/train.py", "--dataset=../data/processed/sample-dataset"]