// src/components/ApiKeyScreen.tsx
import { createSignal } from "solid-js";

interface Props {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyScreen(props: Props) {
  const [value, setValue] = createSignal("");
  const [error, setError] = createSignal("");

  function handleSubmit() {
    const key = value().trim();
    if (!key.startsWith("AIza") || key.length < 20) {
      setError("Invalid API key format");
      return;
    }
    setError("");
    props.onSubmit(key);
  }

  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 Image Generator</text>
      <box flexDirection="column" gap={1} width={50}>
        <text>Enter your Gemini API Key:</text>
        <input
          value={value()}
          onChange={(v) => setValue(v)}
          onSubmit={handleSubmit}
          placeholder="AIza..."
          width={50}
        />
        <text color="red">{error()}</text>
        <text color="gray" attributes={0x02}>
          Key will be saved to ~/.config/nano-cli/config.json
        </text>
      </box>
    </box>
  );
}
