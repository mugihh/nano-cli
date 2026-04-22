// src/components/ApiKeyScreen.tsx
import { createSignal } from "solid-js";
import type { Provider } from "../lib/providers";

interface Props {
  provider: Provider;
  initialValue?: string;
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyScreen(props: Props) {
  const [value, setValue] = createSignal(props.initialValue ?? "");
  const [error, setError] = createSignal("");

  function handleSubmit() {
    const key = value().trim();
    const isGeminiKey = key.startsWith("AIza") && key.length >= 20;
    const isOpenAIKey = key.startsWith("sk-") && key.length >= 20;
    const isValid =
      props.provider === "gemini" ? isGeminiKey : isOpenAIKey;

    if (!isValid) {
      setError(
        props.provider === "gemini"
          ? "Invalid Gemini API key format"
          : "Invalid OpenAI API key format",
      );
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
        <text>
          Enter your {props.provider === "gemini" ? "Gemini" : "OpenAI"} API
          Key:
        </text>
        <input
          value={value()}
          onChange={(v) => setValue(v)}
          onSubmit={handleSubmit}
          placeholder={props.provider === "gemini" ? "AIza..." : "sk-..."}
          width={50}
        />
        <text style={{ fg: "red" }}>{error()}</text>
        <text style={{ fg: "gray", attributes: 0x02 }}>
          Key will be saved to ~/.config/nano-cli/config.json
        </text>
      </box>
    </box>
  );
}
