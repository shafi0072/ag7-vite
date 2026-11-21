#!/bin/bash
set -e
echo "Starting OpenClaw for user: $USER_ID"
export OPENCLAW_CONFIG_DIR=/data/memory/$USER_ID
mkdir -p "$OPENCLAW_CONFIG_DIR"

# Clean stale config artifacts
rm -f "$OPENCLAW_CONFIG_DIR/.openclaw/openclaw.json"*

# Configure OpenClaw with Moonshot Kimi K2.5 + non-loopback binding
mkdir -p "$OPENCLAW_CONFIG_DIR/.openclaw"
mkdir -p /root/.openclaw
cat > "$OPENCLAW_CONFIG_DIR/.openclaw/openclaw.json" <<CONF
{
  "gateway": {
    "controlUi": {
      "dangerouslyAllowHostHeaderOriginFallback": true,
      "dangerouslyDisableDeviceAuth": true
    },
    "auth": {
      "mode": "token",
      "token": "${GATEWAY_TOKEN:-$KIMI_API_KEY}"
    }
  },
  "env": {
    "MOONSHOT_API_KEY": "$KIMI_API_KEY"
  },
  "agents": {
    "defaults": {
      "model": { "primary": "moonshot/kimi-k2.5" }
    }
  },
  "channels": {
    "telegram": {
      "dmPolicy": "open",
      "allowFrom": ["*"]
    }
  },
  "models": {
    "mode": "merge",
    "providers": {
      "moonshot": {
        "baseUrl": "https://api.moonshot.ai/v1",
        "apiKey": "\${MOONSHOT_API_KEY}",
        "api": "openai-completions",
        "models": [
          {
            "id": "kimi-k2.5",
            "name": "Kimi K2.5",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 256000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
CONF
cp "$OPENCLAW_CONFIG_DIR/.openclaw/openclaw.json" /root/.openclaw/openclaw.json
export HOME="$OPENCLAW_CONFIG_DIR"

# Telegram: add channel after gateway starts
if [ -n "$TELEGRAM_BOT_TOKEN" ]; then
  (
    echo "[telegram] Waiting for gateway..."
    until curl -sf http://localhost:18789/ > /dev/null 2>&1; do sleep 2; done
    echo "[telegram] Gateway ready. Adding channel..."
    openclaw channels add --channel telegram --token "$TELEGRAM_BOT_TOKEN" 2>&1 || echo "[telegram] Channel may already exist"
    echo "[telegram] Channel configured (dmPolicy: open, no pairing required)."
  ) &
fi

exec openclaw gateway --bind lan --port 18789 --allow-unconfigured
