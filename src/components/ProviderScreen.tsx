import type { Provider } from "../lib/providers";

interface Props {
  selectRef: (el: any) => void;
}

const OPTIONS = [
  {
    name: "Gemini",
    description: "Google image generation models",
    value: "gemini" as Provider,
  },
  {
    name: "OpenAI",
    description: "GPT Image models",
    value: "openai" as Provider,
  },
];

export { OPTIONS as PROVIDER_OPTIONS };

export function ProviderScreen(props: Props) {
  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 Step 1 / 5 — Choose a provider</text>
      <select ref={props.selectRef} options={OPTIONS} width={50} height={4} />
      <text style={{ fg: "gray" }}>↑ ↓ to move, Enter to confirm</text>
    </box>
  );
}
