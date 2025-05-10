FROM node:22-alpine
WORKDIR /app
# Create non-root user
RUN adduser -D appuser && chown appuser /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
USER appuser
CMD ["npm", "run", "preview"]