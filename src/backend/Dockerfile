FROM node:20-alpine

WORKDIR /app

# Install Docker CLI (needed to reload nginx and manage containers)
RUN apk add --no-cache docker-cli

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
