FROM python:3.10-slim
WORKDIR /app
# Create non-root user
RUN useradd -m appuser && chown appuser /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 9000
USER appuser
CMD ["python", "-m", "ai-ml.models.lora.inference"]
