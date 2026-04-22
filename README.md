# 🍌 nano-cli

A terminal UI for generating images with Gemini or OpenAI.

## Usage

```bash
bun install
bun run dev
```

On first run, you'll choose a provider and enter the matching API key:

- Gemini keys are saved as `apiKey`
- OpenAI keys are saved as `openaiApiKey`

Both are stored in `~/.config/nano-cli/config.json`.

## Development (mock mode)

No API key needed:

```bash
bun run mock
```

## Keyboard

- `↑` / `↓` to move
- `Enter` to confirm
- `Esc` to go back

## Flow

### Gemini

1. Choose provider
2. Choose model
3. Choose aspect ratio
4. Choose save path
5. Enter a prompt

### OpenAI

1. Choose provider
2. Choose model
3. Choose image size
4. Choose save path
5. Enter a prompt

Generated images are saved locally to the selected path.

## Models

### Gemini

| Name | API model |
| --- | --- |
| Nano Banana | `gemini-2.0-flash-preview-image-generation` |
| Nano Banana Pro | `gemini-3.1-flash-image-preview` |

### OpenAI

| Name | API model |
| --- | --- |
| GPT Image 2 | `gpt-image-2` |

## Save Path Presets

- `~/Pictures/nano-cli`
- `./output`
- Custom path
