import { createSignal } from "solid-js";

interface Props {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  step?: string;
}

export function GenerateScreen(props: Props) {
  const [prompt, setPrompt] = createSignal("");

  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 {props.step ?? "Step 4 / 4"} — Enter your prompt</text>

      <box flexDirection="column" gap={1} width={60}>
        <input
          value={prompt()}
          onChange={(v: string) => setPrompt(v)}
          onSubmit={() => {
            if (!prompt().trim() || props.isLoading) return;
            props.onSubmit(prompt().trim());
          }}
          placeholder="A banana floating in space..."
          width={60}
        />
        {props.isLoading ? (
          <text style={{ fg: "yellow" }}>⏳ Generating...</text>
        ) : (
          <text style={{ fg: "gray" }}>Enter to generate</text>
        )}
      </box>
    </box>
  );
}
