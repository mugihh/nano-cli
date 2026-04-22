import type { Model as GeminiModel } from "../lib/gemini";
import type { Model as OpenAIModel } from "../lib/openai";

interface Props {
  options: Array<{
    name: string;
    description: string;
    value: string;
  }>;
  selectRef: (el: any) => void;
  step?: string;
}

const GEMINI_OPTIONS = [
  {
    name: "Nano Banana",
    description: "gemini-2.0-flash — faster, cheaper",
    value: "nano-banana" as GeminiModel,
  },
  {
    name: "Nano Banana Pro",
    description: "gemini-3.1-flash — higher quality",
    value: "nano-banana-pro" as GeminiModel,
  },
];

const OPENAI_OPTIONS = [
  {
    name: "GPT Image 2",
    description: "Latest OpenAI image model",
    value: "gpt-image-2" as OpenAIModel,
  },
];

export {
  GEMINI_OPTIONS as GEMINI_MODEL_OPTIONS,
  OPENAI_OPTIONS as OPENAI_MODEL_OPTIONS,
};

export function ModelScreen(props: Props) {
  return (
    <box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap={1}
    >
      <ascii_font font="tiny" text="nano-cli" />
      <text>🍌 {props.step ?? "Step 1 / 4"} — Choose a model</text>
      <select
        ref={props.selectRef}
        options={props.options}
        width={50}
        height={Math.max(props.options.length + 2, 4)}
      />
      <text style={{ fg: "gray" }}>↑ ↓ to move, Enter to confirm</text>
    </box>
  );
}
