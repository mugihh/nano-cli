# 🍌 nano-cli

A terminal UI for generating images with Google Gemini.

## Usage

```bash
bun install
bun run start
```

On first run, you'll be asked for your Gemini API key. It will be saved locally for future use.

## Development (mock mode)

No API key needed:

```bash
bun run mock
```

## Flow

1. Choose a model — Nano Banana or Nano Banana Pro
2. Choose an aspect ratio
3. Enter a prompt
4. Images are saved locally

## Models

| Name            | Model            |
| --------------- | ---------------- |
| Nano Banana     | gemini-2.0-flash |
| Nano Banana Pro | gemini-3.1-flash |
