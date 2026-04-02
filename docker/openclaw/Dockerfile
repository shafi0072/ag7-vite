FROM node:22-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl bash git python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm
WORKDIR /app
RUN git clone https://github.com/openclaw/openclaw.git .
RUN pnpm install
RUN pnpm run build
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p $PNPM_HOME && pnpm link --global
RUN mkdir -p /data/memory
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
VOLUME ["/data/memory"]
EXPOSE 18789
ENTRYPOINT ["./entrypoint.sh"]
