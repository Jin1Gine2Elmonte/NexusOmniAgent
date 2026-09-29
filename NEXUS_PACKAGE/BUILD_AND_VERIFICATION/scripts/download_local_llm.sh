#!/bin/bash
set -e

LOCAL_MODELS_DIR="$(pwd)/local_models"
ZIP_PATH="$LOCAL_MODELS_DIR/llama-bin.zip"
LLAMA_SERVER_PATH="$LOCAL_MODELS_DIR/llama-server"
MODEL_PATH="$LOCAL_MODELS_DIR/qwen2.5-0.5b-instruct-q4_k_m.gguf"

BINARY_URL="https://github.com/ggerganov/llama.cpp/releases/download/b4594/llama-b4594-bin-ubuntu-x64.zip"
MODEL_URL="https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf"

echo "=== STARTING SOVEREIGN LOCAL LLM DOWNLOAD ==="
mkdir -p "$LOCAL_MODELS_DIR"

echo "[1/4] Downloading llama.cpp binary zip from GitHub..."
wget -q --show-progress -O "$ZIP_PATH" "$BINARY_URL" || curl -L -o "$ZIP_PATH" "$BINARY_URL"

echo "[2/4] Unzipping llama.cpp binary..."
unzip -o "$ZIP_PATH" -d "$LOCAL_MODELS_DIR"

# Find and place llama-server binary
echo "[3/4] Finding and configuring llama-server binary..."
if [ -f "$LOCAL_MODELS_DIR/llama-server" ]; then
    chmod +x "$LOCAL_MODELS_DIR/llama-server"
elif [ -f "$LOCAL_MODELS_DIR/bin/llama-server" ]; then
    cp "$LOCAL_MODELS_DIR/bin/llama-server" "$LLAMA_SERVER_PATH"
    chmod +x "$LLAMA_SERVER_PATH"
else
    # Find recursively
    FOUND_BIN=$(find "$LOCAL_MODELS_DIR" -name "llama-server" | head -n 1)
    if [ -n "$FOUND_BIN" ]; then
        cp "$FOUND_BIN" "$LLAMA_SERVER_PATH"
        chmod +x "$LLAMA_SERVER_PATH"
    else
        echo "Error: llama-server not found!"
        exit 1
    fi
fi

# Copy any shared library (.so) files if they exist
find "$LOCAL_MODELS_DIR" -name "*.so" -exec cp {} "$LOCAL_MODELS_DIR/" \; 2>/dev/null || true

# Cleanup zip
rm -f "$ZIP_PATH"

echo "[4/4] Downloading Qwen2.5-0.5B-Instruct-GGUF from Hugging Face..."
if [ ! -f "$MODEL_PATH" ]; then
    wget -q --show-progress -O "$MODEL_PATH" "$MODEL_URL" || curl -L -o "$MODEL_PATH" "$MODEL_URL"
else
    echo "Model already downloaded."
fi

echo "=== SOVEREIGN LOCAL LLM DOWNLOAD COMPLETE ==="
ls -lh "$LOCAL_MODELS_DIR"
